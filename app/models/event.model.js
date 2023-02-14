//Require Mongoose
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const {EventStatuses} = require("../../config/constant")

//Define a schema
const EventSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  schedule_type: {
    type: String,
    required: true
  },
  locations: {
    type: Object,
    required: false
  },
  event_image: {
    type: String,
    required: true
  },
  event_additional_images: {
    type: Object,
    required: false,
    default: null
  },
  status: {
    type: String,
    required: true,
    default: EventStatuses.active
  }
}, { timestamps: true });

EventSchema.pre("save", function (next) {
  this.uuid = uuidv4();
  next();
});
// Compile model from schema
module.exports = mongoose.model("Event", EventSchema);
