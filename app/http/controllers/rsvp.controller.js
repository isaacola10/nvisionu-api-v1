const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { RsvpStatuses } = require("../../../config/constant");
const { VerifyRsvp, FindRsvpByCode } = require("../../queries");
const { RsvpResponse } = require("../response/rsvp.response");

async function verify(request, response) {
  const { error, value } = Joi.object({
    code: Joi.string().required(),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    const rsvp = await FindRsvpByCode({ "code.code": value.code });
    if (!rsvp) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Invalid Code" });
    }
    if (rsvp.status === RsvpStatuses.pending) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Invalid Code" });
    }
    const selected_code = rsvp.code.find((cd) => cd.code === value.code);
    if (selected_code.status === RsvpStatuses.used) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: "Invalid Code" });
    }
    await VerifyRsvp(rsvp, value.code);
    const data = {
      email: rsvp.email,
      event_day: selected_code.event_day,
      ticket_type: selected_code.ticket_type,
    };
    return response.status(StatusCodes.OK).json({
      message: "Code verified successfully",
      data,
    });
  } catch (error) {
    const message = error.message ? error.message : "error verifying rsvp code";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

module.exports = { verify };
