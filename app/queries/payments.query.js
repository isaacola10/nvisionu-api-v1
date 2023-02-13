const PAYMENT = require("../models/payment.model")

async function GetAllPayments() {
  return PAYMENT.find({})
}

async function GetPaymentByUUID(uuid) {
  return PAYMENT.findOne({uuid})
}

async function GetPaymentByTrxID(transaction_id) {
  return PAYMENT.findOne({transaction_id})
}

async function CreatePayment(transaction_id, event, name, email, meta) {
  return new PAYMENT({
    transaction_id,
    event_id: event._id,
    name,
    email,
    meta
  }).save({})
}

async function UpdatePayment(payment, status) {
  return PAYMENT.findOneAndUpdate({uuid: payment.uuid}, {status}, {new: true})
}

module.exports = {GetAllPayments, GetPaymentByUUID, GetPaymentByTrxID, CreatePayment, UpdatePayment}