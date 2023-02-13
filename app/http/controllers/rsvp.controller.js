const {StatusCodes} = require("http-status-codes")
const Joi = require("joi")
const {VerifyRsvp} = require("../../queries");

async function verify(request, response) {
  const {error, value} = Joi.object({
    code: Joi.string().required()
  }).validate(request.body)
  if(error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    const verify_code = await VerifyRsvp(value.code)
    return response.status(StatusCodes.OK).json({
      message: "Code verified successfully",
      rsvp: verify_code
    })
  }catch (error) {
    const message = error.message ? error.message : "error verifying rsvp code"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

module.exports = {verify}