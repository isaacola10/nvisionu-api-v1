const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { RsvpCollectionResponse, RsvpResponse } = require("../../response");
const { GetRsvps, GetRsvp } = require("../../../queries");

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

module.exports = { index, show };
