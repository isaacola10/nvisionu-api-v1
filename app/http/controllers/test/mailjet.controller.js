const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");
const { SEND_MAIL } = require("../../../service/mailjet.service");

async function index(request, response) {
  const { error, value } = Joi.object({
    email: Joi.string().email().required(),
  }).validate(request.body);
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    const content = {
      email: "isaacolaolu10@gmail.com",
      templateId: 4572553,
      variables: {
        event_name: "",
        rsvp_code: 123123,
        event_day: "Day one of this",
        event_description: "This is a description",
        event_location: "this is a venue",
      },
      subject: `RSVP Code`,
    };
    // send email
    const test_mail = await SEND_MAIL(content);
    console.log("====================================");
    console.log({ test_mail });
    console.log("====================================");

    return response.status(StatusCodes.OK).json({
      message: "Mail Sent Successfully",
    });
  } catch (error) {
    const message = error.message ? error.message : "Error sending mail";
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({ message });
  }
}

module.exports = { index };
