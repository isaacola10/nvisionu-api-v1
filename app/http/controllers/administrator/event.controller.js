const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { EventCollectionResponse, EventResponse } = require("../../response");
const { GetAllEvents, GetEvent, CreateEvent, UpdateEvent, DeleteEvent } = require("../../../queries");
const { EventPay } = require("../../../../config/constant");
const slug = require("slug");

async function index(request, response) {
  try {
    return response.status(StatusCodes.OK).json({
      message: "Fetched events successfully",
      events: EventCollectionResponse(await GetAllEvents()),
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function show(request, response) {
  try {
    const event = await GetEvent(request.params.uuid);
    if (!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "Event not found",
      });
    }
    return response.status(StatusCodes.OK).json({
      message: "Fetched event successfully",
      event: EventResponse(event),
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting event";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function create(request, response) {
  try {
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function store(request, response) {
  // Validate Requests
  const { error, value } = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    event_image: Joi.string().required(),
    schedule_type: Joi.string().required().valid("single_day", "multiple_days"),
    locations: Joi.array()
      .items({
        title: Joi.string().required(),
        location: Joi.string().required(),
        date: Joi.string().required(),
        time: Joi.string().required(),
        venue: Joi.string().required(),
        ticket_prices: Joi.array()
          .items({
            type: Joi.string().required(),
            amount: Joi.number().required(),
          })
          .required(),
      })
      .required(),
    additional_images: Joi.array().items(Joi.string()).allow(null),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    let locations = [];
    for (const location of value.locations) {
      let t_prices = [];
      for (const t_type of location.ticket_prices) {
        t_prices.push({
          type: t_type.type,
          amount: t_type.amount,
          slug: slug(t_type.type),
        });
      }
      locations.push({
        title: location.title,
        location: location.location,
        date: location.date,
        time: location.time,
        venue: location.venue,
        ticket_prices: t_prices,
        slug: slug(location.title),
      });
    }
    // create event
    const event = await CreateEvent(value.title, value.description, value.schedule_type, locations, value.event_image, value.additional_images);
    return response.status(StatusCodes.OK).json({
      message: "Event created successfully",
      event: EventResponse(event),
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function update(request, response) {
  // Validate Requests
  const { error, value } = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    event_image: Joi.string().required(),
    amount: Joi.number().allow("", null),
    schedule_type: Joi.string().required().valid("single_day", "multiple_days"),
    locations: Joi.array()
      .items({
        title: Joi.string().required(),
        location: Joi.string().required(),
        date: Joi.string().required(),
        time: Joi.string().required(),
        venue: Joi.string().required(),
        ticket_prices: Joi.array()
          .items({
            type: Joi.string().required(),
            amount: Joi.number().required(),
          })
          .required(),
      })
      .required(),
    additional_images: Joi.array().items(Joi.string()).allow(null),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    // Find event
    const event = await GetEvent(request.params.uuid);
    if (!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Event not found" });
    }
    let locations = [];
    for (const location of value.locations) {
      let t_prices = [];
      for (const t_type of location.ticket_prices) {
        t_prices.push({
          type: t_type.type,
          amount: t_type.amount,
          slug: slug(t_type.type),
        });
      }
      locations.push({
        title: location.title,
        location: location.location,
        date: location.date,
        time: location.time,
        venue: location.venue,
        ticket_prices: t_prices,
        slug: slug(location.title),
      });
    }
    // Update event
    await UpdateEvent(event, value.title, value.description, value.schedule_type, locations, value.image, value.additional_images);
    return response.status(StatusCodes.OK).json({
      message: "Event updated successfully",
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

async function destroy(request, response) {
  try {
    const event = await GetEvent(request.params.uuid);
    if (!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Event not found" });
    }
    await DeleteEvent(event);
    return response.status(StatusCodes.OK).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    const message = error.message ? error.message : "Error getting events";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

module.exports = { index, show, create, store, update, destroy };
