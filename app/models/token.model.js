//Require Mongoose
const mongoose = require("mongoose");

//Define a schema
const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
}, { timestamps: true });
// Compile model from schema
module.exports = mongoose.model("Token", TokenSchema);
