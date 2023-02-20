const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { GetActiveEvent, GetEvent, CreateRsvp, GetPaymentByTrxID, GetEventByParam, GetRsvpByEventID, UpdateRsvpStatus, UpdateManyRsvpStatus, GetRsvpByEmail, FindRsvpByEmailAndEvent, GenerateRsvpCode } = require("../../../queries");
const { EventResponse, PaymentResponse } = require("../../response");
const { EventStatuses, EventPay, RsvpStatuses } = require("../../../../config/constant");
const { SEND_MAIL } = require("../../../service/mailjet.service");
const { initialize, verification } = require("../payment/payment.controller");
const _ = require("lodash");

async function index(request, response) {
  try {
    return response.status(StatusCodes.OK).json({
      event: EventResponse(await GetActiveEvent()),
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function book(request, response) {
  // Validate Requests
  const { error, value } = Joi.object({
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    email: Joi.string().email().required(),
    book_all: Joi.boolean().required(),
    event_type: Joi.string().required(),
    event_day: Joi.when("book_all", {
      is: false,
      then: Joi.string().required(),
    }),
    num_of_tickets: Joi.number().required(),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    let data;
    let amount;
    let locations = [];

    const event = await GetEvent(request.params.uuid);

    if (!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Event not found" });
    }
    if (event.status === EventStatuses.closed) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Event has been closed" });
    }

    if (value.book_all) {
      let ticket_arr = [];
      let price_arr = [];
      const ticket_types = event.locations;

      for (t_types of ticket_types) {
        for (price of t_types.ticket_prices) {
          price_arr.push(price);
        }
      }
      price_arr.find((t_pr) => {
        if (t_pr.slug === value.event_type) {
          ticket_arr.push(t_pr);
        }
      });

      const event_amount = _.sumBy(ticket_arr, function (o) {
        return o.amount;
      });
      amount = value.num_of_tickets * event_amount;

      for (const ev_el of event.locations) {
        const ev_tk = ev_el.ticket_prices.find((f_t) => f_t.slug === value.event_type);
        locations.push({
          title: ev_el.title,
          location: ev_el.location,
          date: ev_el.date,
          time: ev_el.time,
          venue: ev_el.venue,
          ticket_type: ev_tk,
        });
      }
    } else {
      const event_location = event.locations.find((el) => el.slug === value.event_day);
      if (!event_location) {
        return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Event day not found" });
      }
      const ticket_amount = event_location.ticket_prices.find((tp) => tp.slug === value.event_type);
      amount = ticket_amount.amount * value.num_of_tickets;
      const ev_tk = event_location.ticket_prices.find((f_t) => f_t.slug === value.event_type);
      locations.push({
        title: event_location.title,
        location: event_location.location,
        date: event_location.date,
        time: event_location.time,
        venue: event_location.venue,
        ticket_type: ev_tk,
      });
    }
    const { paymentData } = await initialize(event, "NGN", value, amount);
    if (paymentData.status === true) {
      data = paymentData.data;
      // create rsvp
      let loc_codes = [];
      for (let i = 0; i < value.num_of_tickets; i++) {
        for (const loc_code of locations) {
          loc_codes.push({
            code: await GenerateRsvpCode(event),
            event_day: loc_code.title,
            ticket_type: loc_code.ticket_type.type,
            venue: loc_code.venue,
            status: "Active",
          });
        }
      }
      // Create rsvp
      await CreateRsvp(event, value.name, value.email, loc_codes, locations, value.phone_number, value.type, RsvpStatuses.pending);
    }
    return response.status(StatusCodes.OK).json({
      message: "RSVP sent successfully",
      data,
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function book_data(request, response) {
  const { error, value } = Joi.object({
    book_all: Joi.boolean().required(),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    const event = await GetEvent(request.params.uuid);
    if (!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Event not found" });
    }
    let ticket_prices = [];

    if (value.book_all) {
      for (const location of event.locations) {
        ticket_prices.push(location.ticket_prices);
      }
    }
    return response.status(StatusCodes.OK).json({ ticket_prices });
  } catch (error) {
    const message = error.message ? error.message : "Error getting event data";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function verify(request, response) {
  const reference = request.query.reference;
  try {
    const payment = await GetPaymentByTrxID(reference);
    if (!payment) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "Payment not found",
      });
    }
    const event = await GetEventByParam({ _id: payment.event_id });
    if (!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "Event not found",
      });
    }
    await verification(payment);
    const findRsvp = await GetRsvpByEmail(event, payment.email);
    let temp_codes = [];
    for (const code of findRsvp.code) {
      let code_str = `${code.event_day}-${code.code}<br/>`;
      temp_codes.push(code_str);
    }

    let new_string = JSON.stringify(temp_codes).replace(/"|,/g, " ").replace("[", "").replace("]", "");
    // return response.status(StatusCodes.OK).json({ new_string });
    const content = {
      email: findRsvp.email,
      templateId: 4572553,
      variables: {
        event_name: findRsvp.event_id.title,
        event_description: findRsvp.event_id.description,
        codes: new_string,
      },
      subject: `RSVP Code for ${findRsvp.event_id.title}`,
    };

    await UpdateManyRsvpStatus(event, RsvpStatuses.active);

    await SEND_MAIL(content);

    return response.status(StatusCodes.OK).json({
      message: "RSVP sent successfully",
      status: "success",
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

module.exports = { index, book, book_data, verify };
