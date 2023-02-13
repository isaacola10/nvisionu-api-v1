function PaymentResponse(payment) {
  return {
    id: payment.uuid,
    event_id: payment.event_id,
    transaction_id: payment.transaction_id,
    name: payment.name,
    email: payment.email,
    meta: payment.meta,
    status: payment.status
  }
}

function PaymentCollectionResponse(payments) {
  return payments.map((payment) => {
    return PaymentResponse(payment)
  })
}

module.exports = {PaymentResponse, PaymentCollectionResponse}