const mongoose = require("mongoose");
const config = require("../../config/index");
const { v4: uuidv4 } = require("uuid");
const { slug } = require("../../app/helpers/slug");

// connect to mongo db
const mongoUri = config.mongo.host;
const connect = async () => {
  mongoose.connect(mongoUri, { keepAlive: 1 });
  mongoose.connection.on("error", (error) => {
    console.log(error);
    throw new Error(`unable to connect to database: ${mongoUri}`);
  });
};
// End mongo DB connection
const close = function () {
  return new Promise((resolve) => {
    mongoose.connection.close(() => {
      console.log("mongodb connection closed");
      resolve();
    });
  });
};

const RSVP = require("../app/models/rsvp.model");

// Drop tables
const drop = {
  // List the models to drop
  async Rsvp() {
    return RSVP.deleteMany({});
  },
};

const seed = {
  // Product seeder
  async Rsvp() {
    return RSVP.insertMany([
      {
        uuid: uuidv4(),
        name: "Molybdenum",
        description: "Description Here",
        slug: slug("Molybdenum"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
};
// node action
const run = async function () {
  // Start Connection
  await connect();
  // List models to drop
  await drop.Rsvp();

  // List models to seed
  await seed.Rsvp();

  // End Connection
  await close();
  console.log("successfully seeded data");
};
// run seeder
run();
