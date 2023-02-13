const { StatusCodes } = require('http-status-codes');

module.exports = (error, request, response, next) => {
  console.log(error);
  // set default
  let customError = {
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message.replace(/['"]/g, '') || 'Something went wrong try again later',
  };

  // customize Joi validation errors
  if (error.isJoi) {
    customError.message = error.details.map(e => e.message).join("; ");
    customError.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }

  if (error.name === 'ValidationError') {
    customError.message = Object.values(error.errors).map((item) => item.message).join(',');
    customError.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }

  if (error.code && error.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(error.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }

  if (error.name === 'CastError') {
    customError.message = `No item found with id : ${error.value}`;
    customError.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }

  return response.status(customError.statusCode).json({ message: customError.message });
};
