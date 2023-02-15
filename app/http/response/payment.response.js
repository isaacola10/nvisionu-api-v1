function PaymentResponse(payment) {
  return {
    id: payment.uuid,
    event: {
      id: payment.event_id.uuid,
      title: payment.event_id.title,
    },
    transaction_id: payment.transaction_id,
    name: payment.name,
    email: payment.email,
    amount: payment.amount,
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