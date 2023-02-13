const {StatusCodes, UNPROCESSABLE_ENTITY} = require("http-status-codes")
const Joi = require("joi")
const {GetActiveEvent, GetEvent, CreateRsvp, GetPaymentByTrxID, GetEventByParam, GetRsvpByEventID, UpdateRsvpStatus,
  UpdateManyRsvpStatus, GetRsvpByEmail, FindRsvpByEmailAndEvent
} = require("../../../queries");
const {EventResponse, PaymentResponse} = require("../../response");
const {EventStatuses, EventPay, RsvpStatuses} = require("../../../../config/constant");
const {SEND_MAIL} = require("../../../service/mailjet.service");
const {initialize, verification} = require("../payment/payment.controller");
const _ = require("lodash")

async function index(request, response) {
  try {
    return response.status(StatusCodes.OK).json({
      event: EventResponse(await GetActiveEvent())
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting events"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function book(request, response) {
  // Validate Requests
  const {error, value} = Joi.object({
    name: Joi.string().required(),
    phone_number: Joi.string().required(),
    emails: Joi.array().items(Joi.string().email()).required(),
    book_all: Joi.boolean().required(),
    event_type: Joi.when('book_all', {
      is: false,
      then: Joi.string().required()
    }),
    event_day: Joi.when('book_all', {
      is: false,
      then: Joi.string().required()
    }),
    num_of_tickets: Joi.number().required(),
  }).validate(request.body)
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    let data
    let amount
    let locations = []

    const event = await GetEvent(request.params.uuid)
    if(!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: "Event not found"})
    }
    if(event.status === EventStatuses.closed) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: "Event has been closed"})
    }

    if (value.book_all) {
      const event_amount = _.sumBy(event.additional_data, function (o) {
        return o.amount
      })
      const total_event_amount = event_amount * event.locations.length
      amount = value.num_of_tickets * total_event_amount
      locations.push(event.locations)
    }else {
      const event_type = event.additional_data.find(ev => ev.slug === value.event_type)
      const event_location = event.locations.find(el => el.slug === value.event_day)
      if(!event_location) {
        return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: "Event day not found"})
      }
      amount = event_type.amount
      locations.push(event_location)
    }
    const {paymentData, payment} = await initialize(event, "NGN", value, amount)
    if(paymentData.status === true) {
      data = paymentData.data
      // create rsvp
      for(const email of value.emails) {
        const isExists = await FindRsvpByEmailAndEvent(event, email)
        if(!isExists) {
          // Create rsvp
          await CreateRsvp(event, value.name, email, value.emails, locations, value.phone_number, value.type, RsvpStatuses.pending)
        }
      }
    }
    return response.status(StatusCodes.OK).json({
      message: "RSVP sent successfully",
      data
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting events"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function verify(request, response) {
  const reference  = request.query.reference;
  try {
    const payment = await GetPaymentByTrxID(reference)
    if(!payment) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "Payment not found"
      })
    }
    const event = await GetEventByParam({_id: payment.event_id})
    if(!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "Event not found"
      })
    }
    await verification(payment)
    const rsvp = await GetRsvpByEventID(event._id)
    await UpdateManyRsvpStatus(event, RsvpStatuses.active)
    for (const email of rsvp.invitees) {
      const findRsvp = await GetRsvpByEmail(email)
      // Mail Content
      const message = `Your RSVP code is ${findRsvp.code}`
      const content = {
        email: findRsvp.email,
        subject: "RSVP Received",
        body: message
      }
      // send email
      await SEND_MAIL(content)
    }
    return response.status(StatusCodes.OK).json({
      message: "RSVP sent successfully",
      status: "success",
      payment: PaymentResponse(payment)
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting events"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

module.exports = {index, book, verify}