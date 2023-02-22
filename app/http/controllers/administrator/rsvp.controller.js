const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { RsvpCollectionResponse, RsvpResponse } = require("../../response");
const { GetRsvps, GetRsvp, GetPaymentByTrxID } = require("../../../queries");
const { PaymentStatuses } = require("../../../../config/constant");

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
    });
  } catch (error) {
    const message = error.message ? error.message : "Error checking payment reference";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function create(request, response) {
  try {
  } catch (error) {
    const message = error.message ? error.message : "Error fetching data";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function store(request, response) {
  try {
  } catch (error) {
    const message = error.message ? error.message : "Error storing rsvp";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

module.exports = { index, show, check, create, store };
