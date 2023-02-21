const { initializePayment, verifyPayment } = require("./paystack.controller");
const { CreatePayment, UpdatePayment } = require("../../../queries");
const { PaymentStatuses } = require("../../../../config/constant");

async function initialize(event, currency, value, amount) {
  let data;
  const PaystackData = {
    email: value.email,
    amount: amount * 100,
  };
  data = await initializePayment(PaystackData);
  const payment = await CreatePayment(data.data.reference, event, value.name, value.email, amount, data.data);
  return { paymentData: data, payment };
}

async function verification(payment) {
  const data = await verifyPayment(payment.transaction_id);
  console.log("====================================");
  console.log({ data });
  console.log("====================================");
  if (data.status === true) {
    await UpdatePayment(payment, PaymentStatuses.successful);
  } else {
    return data;
  }
  return data;
}

module.exports = { initialize, verification };
