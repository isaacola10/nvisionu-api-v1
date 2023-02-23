const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { RsvpCollectionResponse, RsvpResponse, EventResponse, PaymentResponse } = require("../../response");
const { GetRsvps, GetRsvp, GetPaymentByTrxID, GetActiveEvent, GetEvent, CreateRsvp, GenerateRsvpCode, UpdateManyRsvpStatus } = require("../../../queries");
const { PaymentStatuses, RsvpStatuses, EventStatuses } = require("../../../../config/constant");
const moment = require("moment");
const { SEND_MAIL } = require("../../../service/mailjet.service");

async function index(request, response) {
  try {
    const rsvps = await GetRsvps();
    let total_tickets = [];
    for (const ticket of rsvps) {
      for (let code_ticket of ticket.code) {
        total_tickets.push(code_ticket);
      }
    }
    return response.status(StatusCodes.OK).json({
      message: "Fetched RSVPs successfully",
      rsvps: RsvpCollectionResponse(rsvps),
      num_of_tickets: total_tickets.length,
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting rsvps";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function show(request, response) {
  try {
    const rsvp = await GetRsvp(request.params.uuid);
    if (!rsvp) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "RSVP not found" });
    }
    return response.status(StatusCodes.OK).json({
      message: "Fetched RSVP successfully",
      rsvp: RsvpResponse(rsvp),
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting rsvp";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function check(request, response) {
  const { error, value } = Joi.object({
    reference_id: Joi.string().required(),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    const payment = await GetPaymentByTrxID(value.reference_id);
    if (!payment) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Payment not found" });
    }
    if (payment.status !== PaymentStatuses.successful) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Payment not successful" });
    }
    // Return true check
    return response.status(StatusCodes.OK).json({
      message: "Check successful",
      check: true,
      payment: PaymentResponse(payment),
    });
  } catch (error) {
    const message = error.message ? error.message : "Error checking payment reference";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function create(request, response) {
  try {
    return response.status(StatusCodes.OK).json({
      event: EventResponse(await GetActiveEvent()),
    });
  } catch (error) {
    const message = error.message ? error.message : "Error fetching data";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function store(request, response) {
  const { error, value } = Joi.object({
    reference_id: Joi.string().required(),
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    event_type: Joi.string().required(),
    event_day: Joi.string().required(),
    num_of_tickets: Joi.number().required(),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    const payment = await GetPaymentByTrxID(value.reference_id);
    if (!payment) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Payment not found" });
    }
    if (payment.status !== PaymentStatuses.successful) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Payment not successful" });
    }
    let data;
    let amount;
    let locations = [];

    const event = await GetEvent(payment.event_id.uuid);

    if (!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Event not found" });
    }
    if (event.status === EventStatuses.closed) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Event has been closed" });
    }
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
    const findRsvp = await CreateRsvp(event, value.name, "isaacolaolu10@gmail.com", loc_codes, locations, value.phone_number, value.type, RsvpStatuses.active);

    let event_data = event.locations.find((el) => findRsvp.code[0].event_day === el.title);
    let temp_codes = [];
    for (const code of findRsvp.code) {
      let code_str = `<h3>(${event_data.location}) ${event_data.title} - ${code.code}</h3>`;
      temp_codes.push(code_str);
    }
    let new_string = JSON.stringify(temp_codes).replace(/"|,/g, "").replace("[", "").replace("]", "");
    const content = {
      email: findRsvp.email,
      templateId: 4599818,
      variables: {
        event_name: event.title,
        event_description: event.description,
        codes: new_string,
        date: moment(event_data.date).format("MMMM Do YYYY"),
        venue: event_data.venue,
        time: moment(event_data.time, "HH:mm:ss").format("hh:mm A"),
      },
      subject: `RSVP Code for ${event.title} Event`,
    };

    await UpdateManyRsvpStatus(event, RsvpStatuses.active);

    await SEND_MAIL(content);

    return response.status(StatusCodes.OK).json({
      message: "RSVP sent successfully",
    });
  } catch (error) {
    const message = error.message ? error.message : "Error storing rsvp";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

module.exports = { index, show, check, create, store };
