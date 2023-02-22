const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { GetRsvps, FindTicketsByLocation } = require("../../../queries");

async function index(request, response) {
  try {
    const rsvps = await GetRsvps();
    let locations = [];
    for (const location of rsvps) {
      for (const venue of location.locations) {
        locations.push(venue.location);
      }
    }
    uniq_location = [...new Set(locations)];

    return response.status(StatusCodes.OK).json({
      message: "Dashboard data fetched successfully",
      uniq_location,
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function tickets(request, response) {
  const { error, value } = Joi.object({
    location: Joi.string().required(),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    const location = await FindTicketsByLocation(value.location);
    let total_tickets = [];
    for (const ticket of location) {
      for (let code_ticket of ticket.code) {
        total_tickets.push(code_ticket);
      }
    }

    return response.status(StatusCodes.OK).json({
      message: "Dashboard data fetched successfully",
      location,
      num_of_tickets: total_tickets.length,
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

module.exports = { index, tickets };
