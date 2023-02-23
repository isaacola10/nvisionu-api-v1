const PAYMENT = require("../models/payment.model");

async function GetAllPayments() {
  return PAYMENT.find({}).populate({ path: "event_id", model: "Event" }).sort({ createdAt: -1 });
}

async function GetPaymentByUUID(uuid) {
  return PAYMENT.findOne({ uuid });
}

async function GetPaymentByTrxID(transaction_id) {
  return PAYMENT.findOne({ transaction_id }).populate({ path: "event_id", model: "Event" });
}

async function CreatePayment(transaction_id, event, name, email, amount, meta) {
  return new PAYMENT({
    transaction_id,
    event_id: event._id,
    name,
    email,
    amount,
    meta,
  }).save({});
}

async function UpdatePayment(payment, status) {
  return PAYMENT.findOneAndUpdate({ uuid: payment.uuid }, { status }, { new: true });
}

module.exports = { GetAllPayments, GetPaymentByUUID, GetPaymentByTrxID, CreatePayment, UpdatePayment };
