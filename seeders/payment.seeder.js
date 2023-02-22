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

const PAYMENT = require("../app/models/payment.model");

// Drop tables
const drop = {
  // List the models to drop
  async PAYMENT() {
    return PAYMENT.deleteMany({});
  },
};

const seed = {
  // Product seeder
  async PAYMENT() {
    return PAYMENT.insertMany([
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "rypw2w7sse",
        name: "Nvisionu Nigeria",
        email: "nvisionunigeria@cowastrading.com",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: mongoose.Schema.Types.ObjectId("63ede326151a10e23a4e0358"),
        transaction_id: "",
        name: "",
        email: "",
        amount: 5000,
        meta: {},
        status: "Successful",
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
  await drop.PAYMENT();

  // List models to seed
  await seed.PAYMENT();

  // End Connection
  await close();
  console.log("successfully seeded data");
};
// run seeder
run();
