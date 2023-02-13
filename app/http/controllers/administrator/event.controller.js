const {StatusCodes} = require("http-status-codes")
const Joi = require("joi")
const {EventCollectionResponse, EventResponse} = require("../../response");
const {GetAllEvents, GetEvent, CreateEvent, UpdateEvent, DeleteEvent} = require("../../../queries");
const {EventPay} = require("../../../../config/constant");
const slug = require("slug")

async function index(request, response) {
  try {
    return response.status(StatusCodes.OK).json({
      message: "Fetched events successfully",
      events: EventCollectionResponse(await GetAllEvents())
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting events"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function show(request, response) {
  try {
    const event = await GetEvent(request.params.uuid)
    if(!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message: "Event not found"
      })
    }
    return response.status(StatusCodes.OK).json({
      message: "Fetched event successfully",
      event: EventResponse(event)
    })

  }catch (error) {
    const message = error.message ? error.message : "Error getting event"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function create(request, response) {
  try {

  }catch (error) {
    const message = error.message ? error.message : "Error getting events"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function store(request, response) {
  // Validate Requests
  const {error, value} = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    event_image: Joi.string().required(),
    payment: Joi.string().lowercase().valid("free", "charged"),
    additional_data: Joi.array().items({
      type: Joi.string().required(),
      amount: Joi.number().required()
    }).allow(null),
    schedule_type: Joi.string().required().valid("single_day", "multiple_days"),
    locations: Joi.array().items({
      title: Joi.string().required(),
      location: Joi.string().required(),
      date: Joi.string().required(),
      time: Joi.string().required(),
      venue: Joi.string().required(),
    }).required(),
    additional_images: Joi.array().items(Joi.string()).allow(null),
  }).validate(request.body)
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    let additional_data = value.additional_data ? [] : null
    if(value.additional_data) {
      for (const add_data of value.additional_data) {
        additional_data.push({
          type: add_data.type,
          amount: add_data.amount,
          slug: slug(add_data.type)
        })
      }
    }
    let locations = []
    for (const location of value.locations) {
      locations.push({
        title: location.title,
        location: location.location,
        date: location.date,
        time: location.time,
        venue: location.venue,
        slug: slug(location.title)
      })
    }
    // create event
    const event = await CreateEvent(value.title, value.description, value.schedule_type, locations, value.event_image, value.additional_images, value.payment, additional_data);
    return response.status(StatusCodes.OK).json({
      message: "Event created successfully",
      event: EventResponse(event)
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting events"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function update(request, response) {
  // Validate Requests
  const {error, value} = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    event_image: Joi.string().required(),
    payment: Joi.string().lowercase().valid("free", "charged"),
    amount: Joi.number().allow("", null),
    additional_data: Joi.array().items({
      type: Joi.string().required(),
      amount: Joi.number().required()
    }).allow(null),
    schedule_type: Joi.string().required().valid("single_day", "multiple_days"),
    locations: Joi.array().items({
      title: Joi.string().required(),
      location: Joi.string().required(),
      date: Joi.string().required(),
      time: Joi.string().required(),
      venue: Joi.string().required(),
    }).required(),
    additional_images: Joi.array().items(Joi.string()).allow(null),
  }).validate(request.body)
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    // Find event
    const event = await GetEvent(request.params.uuid)
    if(!event) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: "Event not found"})
    }
    let additional_data = []
    for (const add_data of value.additional_data) {
      additional_data.push({
        type: add_data.type,
        amount: add_data.amount,
        slug: slug(add_data.type)
      })
    }
    // Update event
    await UpdateEvent(event, value.title, value.description, value.schedule_type, value.locations, value.image, value.additional_images, value.payment, additional_data)
    return response.status(StatusCodes.OK).json({
      message: "Event updated successfully"
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting events"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function destroy(request, response) {
  try {
    const event = await GetEvent(request.params.uuid)
    if(!event){
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: "Event not found"})
    }
    await DeleteEvent(event)
    return response.status(StatusCodes.OK).json({
      message: "Event deleted successfully"
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting events"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

module.exports = {index, show, create, store, update, destroy}