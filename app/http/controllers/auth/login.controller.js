const {StatusCodes} = require("http-status-codes")
const Joi = require("joi")
const {FindAdministrator, IsPasswordMatch, CreateAuthToken} = require("../../../queries");
const Cache = require("../../../service/cache.service");
const {CacheKeyTypes} = require("../../../../config/constant")

async function login(request, response) {
  // Validate request
  const {error, value} = Joi.object({
    email: Joi.string().lowercase().email().required(),
    password: Joi.string().min(7).required()
  }).validate(request.body)
  if (error) {
    return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: error.message.replace(/['"]/g, "") });
  }
  try {
    const admin = await FindAdministrator(value.email)
    if (!admin || !(await IsPasswordMatch(admin, value.password))) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: "Password or Email is incorrect"})
    }
    /** Delete login token Cache */
    await Cache.del(CacheKeyTypes.login + admin.uuid)

    return response.status(StatusCodes.OK).json({
      message: "Admin successfully logged",
      admin,
      token: await CreateAuthToken(admin)
    })
  }catch (error) {
    const message = error.message ? error.message : "error during login"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({
      message
    })
  }
}

module.exports = {login}