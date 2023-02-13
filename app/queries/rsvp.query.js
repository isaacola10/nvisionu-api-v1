const RSVP = require("../models/rsvp.model")
const {RsvpStatuses} = require("../../config/constant");

async function GetRsvps() {
  return RSVP.find({})
}

async function GetRsvp(uuid) {
  return RSVP.findOne({uuid})
}

async function GetRsvpByEmail(email) {
  return RSVP.findOne({email})
}

async function GetRsvpByEventID(event_id) {
  return RSVP.findOne({event_id})
}

async function FindRsvpByEventAndCode(event, code) {
  return RSVP.findOne({event_id: event._id, code})
}

async function FindRsvpByCode(code) {
  return RSVP.findOne({code})
}

async function FindRsvpByEmailAndEvent(event, email) {
  return RSVP.findOne({event_id: event._id, email})
}

async function CreateRsvp(event, name, email, invitees, locations, phone_number, type, status=RsvpStatuses.active) {
  return new RSVP({
    event_id: event._id,
    name,
    email,
    invitees,
    locations,
    phone_number,
    type,
    code: await GenerateRsvpCode(event),
    status
  }).save()
}

async function UpdateRsvpStatus(rsvp, status) {
  return RSVP.findOneAndUpdate({uuid: rsvp.uuid}, {status}, {new: true})
}

async function UpdateManyRsvpStatus(event, status) {
  return RSVP.updateMany({event_id: event._id}, {status})
}

async function GenerateRsvpCode(event, length = 7, chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    let rString = "";
    for (let i = length; i > 0; --i)
      rString += chars[Math.floor(Math.random() * chars.length)];
    const generated_rsvp_code = (rString).toUpperCase();
    if (!(await FindRsvpByEventAndCode(event, generated_rsvp_code))) {
      return generated_rsvp_code;
    }
    return GenerateRsvpCode();
}

async function VerifyRsvp(code) {
  return RSVP.findOneAndUpdate({code, status: RsvpStatuses.active}, {status: RsvpStatuses.used}, {new: true})
}

module.exports = { GetRsvp, GetRsvps, CreateRsvp, VerifyRsvp, UpdateRsvpStatus, GetRsvpByEventID, UpdateManyRsvpStatus, GetRsvpByEmail, FindRsvpByEmailAndEvent, FindRsvpByEventAndCode }