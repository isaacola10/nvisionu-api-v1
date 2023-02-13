const https = require("https");
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const initializePayment = (data) => {
  // const callback_url = process.env.NODE_ENV === "production" ? "https://fairmall-v1.herokuapp.com/api/v1/user/order/payment/verify" : "http://localhost:5007/api/v1/user/order/payment/verify"
  const callback_url = "http://localhost:5050/api/v1/";
  const params = JSON.stringify({
    email: data.email,
    amount: data.amount,
    callback_url: callback_url,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const makeRequest = async () => {
    return new Promise(function (resolve, reject) {
      const req = https.request(options, function (res) {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      });
      req.write(params);
      req.end();
    });
  };
  return makeRequest();
};

const verifyPayment = (reference) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${SECRET_KEY}`,
    },
  };

  const verifyRequest = async () => {
    return new Promise(function (resolve, reject) {
      const req = https.request(options, function (res) {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      });
      req.end();
    });
  };
  return verifyRequest();
};

module.exports = { initializePayment, verifyPayment };
