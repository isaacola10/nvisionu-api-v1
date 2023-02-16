
const EVENT = require("../models/event.model")
const {EventStatuses} = require("../../config/constant");

async function GetAllEvents() {
  return EVENT.find({}).sort({createdAt: -1})
}

async function GetActiveEvent() {
  return EVENT.findOne({status: EventStatuses.active})
}

async function GetEvent(uuid) {
  return EVENT.findOne({uuid})
}

async function GetEventByParam(param) {
  return EVENT.findOne(param)
}

async function CreateEvent(title, description, schedule_type, locations, event_image, event_additional_images, book_all, session=null) {
  await UpdateEvents()

  return new EVENT({
    title,
    description,
    schedule_type,
    locations,
    event_image,
    event_additional_images,
    book_all,
  }).save({ session });
}

async function UpdateEvent(event, title, description, schedule_type, locations, event_image, event_additional_images, book_all, session = null) {
  return EVENT.findOneAndUpdate(
    { uuid: event.uuid },
    {
      title,
      description,
      schedule_type,
      locations,
      event_image,
      event_additional_images,
      book_all,
    },
    { new: true, session }
  );
}

async function DeleteEvent(event) {
  return EVENT.findOneAndDelete({uuid: event.uuid})
}

async function UpdateEvents() {
  return EVENT.updateMany({status: EventStatuses.active}, {status: EventStatuses.closed})
}

module.exports = {GetEvent, GetAllEvents, GetActiveEvent, CreateEvent, UpdateEvent, DeleteEvent, GetEventByParam}