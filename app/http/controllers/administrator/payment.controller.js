const {StatusCodes} = require("http-status-codes")
const Joi = require("joi")
const {PaymentResponse, PaymentCollectionResponse} = require("../../response");
const {GetAllPayments, GetPaymentByUUID} = require("../../../queries");

async function index(request, response) {
  try {
    return response.status(StatusCodes.OK).json({
      message: "Fetched payment successfully",
      payments: PaymentCollectionResponse(await GetAllPayments())
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting payments"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

async function show(request, response) {
  try {
    const payment = await GetPaymentByUUID(request.params.uuid)
    if(!payment) {
      return response.status(StatusCodes.UNPROCESSABLE_ENTITY).json({message: "Payment not found"})
    }
    return response.status(StatusCodes.OK).json({
      message: "Payment Fetched successfully",
      payment: PaymentResponse(payment)
    })
  }catch (error) {
    const message = error.message ? error.message : "Error getting payment"
    return response.status(StatusCodes.NOT_ACCEPTABLE).json({message})
  }
}

module.exports = {index, show}