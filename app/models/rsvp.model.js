//Require Mongoose
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { RsvpStatuses } = require("../../config/constant");

//Define a schema
const RsvpSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      unique: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
    name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    invitees: {
      type: Object,
      required: true,
    },
    locations: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: null,
    },
    code: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: RsvpStatuses.active,
    },
  },
  { timestamps: true }
);

RsvpSchema.pre("save", function (next) {
  this.uuid = uuidv4();
  next();
});
// Compile model from schema
module.exports = mongoose.model("Rsvp", RsvpSchema);
