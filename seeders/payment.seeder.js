const mongoose = require("mongoose");
const config = require("../config/index");
const { v4: uuidv4 } = require("uuid");

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
        event_id: "63ede326151a10e23a4e0358",
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
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "4lldpuxm65",
        name: "Nvisionu Nigeria",
        email: "queenethokeke@gmail.com",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "on8fh1u616",
        name: "Nvisionu Nigeria",
        email: "queenethokeke@gmail.com",
        amount: 3000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "5enpun3p9j",
        name: "Nvisionu Nigeria",
        email: "maryamshehu1004@yahoo.com",
        amount: 6000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "n92m4eausx",
        name: "Nvisionu Nigeria",
        email: "bianca.akusinanwa@yahoo.com",
        amount: 25000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "rqx6la050q",
        name: "Nvisionu Nigeria",
        email: "lawretao1@yahoo.com",
        amount: 9000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "pdbjffndrf",
        name: "Nvisionu Nigeria",
        email: "neloperry@gmail.com",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "6ie1xv8mo6",
        name: "Nvisionu Nigeria",
        email: "augusta.imojack@gmail.com",
        amount: 6000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "mq9chyiups",
        name: "Nvisionu Nigeria",
        email: "shodunketonia366@gmail.com",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "ba7go1s5bs",
        name: "Nvisionu Nigeria",
        email: "tuk4mandy@yahoo.com",
        amount: 6000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "ew8ga1681h",
        name: "Nvisionu Nigeria",
        email: "ritaogueri@gmail.com",
        amount: 10000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "p2h9rzg2ha",
        name: "Nvisionu Nigeria",
        email: "nwosua24@gmail.com",
        amount: 3000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "35layrlh15",
        name: "Nvisionu Nigeria",
        email: "yiranwakoh@yahoo.com",
        amount: 3000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "xuldj5gj8e",
        name: "Nvisionu Nigeria",
        email: "vdeorti@gmail.com",
        amount: 3000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "5cz4qii539",
        name: "Nvisionu Nigeria",
        email: "isibortemi@gmail.com",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "jnsosqtn3o",
        name: "Nvisionu Nigeria",
        email: "rafiat.moninuola@gmail.com",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "ai2gawskg9",
        name: "Nvisionu Nigeria",
        email: "jcoretravelsandtour@gmail.com",
        amount: 3000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "svcrm9jh9r",
        name: "Nvisionu Nigeria",
        email: "chuksidigbe@gmail.com",
        amount: 5000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "193sg99vmt",
        name: "Nvisionu Nigeria",
        email: "augusta.imojack@gmail.com",
        amount: 6000,
        meta: {},
        status: "Successful",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        event_id: "63ede326151a10e23a4e0358",
        transaction_id: "7vtl5ipdzc",
        name: "Nvisionu Nigeria",
        email: "aziolali26@gmail.com",
        amount: 3000,
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
  // await drop.PAYMENT();

  // List models to seed
  await seed.PAYMENT();

  // End Connection
  await close();
  console.log("successfully seeded data");
};
// run seeder
run();
