const {StatusCodes} = require("http-status-codes")
const Joi = require("joi")
const {RsvpCollectionResponse, RsvpResponse} = require("../../response");
const {GetRsvps, GetRsvp} = require("../../../queries")

async function index(request, response) {
  try {
    return response.status(StatusCodes.OK).json({
      message: "Fetched RSVPs successfully",
      rsvps: RsvpCollectionResponse(await GetRsvps())
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting rsvps"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function show(request, response) {
  try {
    const rsvp = await GetRsvp(request.params.uuid)
    if(!rsvp) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: "RSVP not found"})
    }
    return response.status(StatusCodes.OK).json({
      message: "Fetched RSVP successfully",
      rsvp: RsvpResponse(rsvp)
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting rsvp"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}


module.exports = {index, show}