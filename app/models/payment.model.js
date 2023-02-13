//Require Mongoose
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const {PaymentStatuses} = require("../../config/constant")

//Define a schema
const PaymentSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  meta: {
    type: Object,
    required: false
  },
  status: {
    type: String,
    required: true,
    default: PaymentStatuses.pending
  }
}, { timestamps: true });

PaymentSchema.pre("save", function (next) {
  this.uuid = uuidv4();
  next();
});
// Compile model from schema
module.exports = mongoose.model("Payment", PaymentSchema);
