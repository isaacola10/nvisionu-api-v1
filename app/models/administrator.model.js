//Require Mongoose
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

//Define a schema
const AdministratorSchema = new mongoose.Schema({
  uuid: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

AdministratorSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  this.uuid = uuidv4();
  next();
});
// Compile model from schema
module.exports = mongoose.model("Administrator", AdministratorSchema);
