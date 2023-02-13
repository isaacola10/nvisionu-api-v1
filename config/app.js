require("dotenv").config();
require("express-async-errors");
const listEndpoints = require("express-list-endpoints");
// use only if reverse proxy is absent for fast response
const compression = require("compression");
// express app
const express = require("express")
// security packages
const rateLimiter = require("express-rate-limit");
const rateApiLimit = rateLimiter({
  windowMs: 60 * 1000, // 1 minutes
  max: 30, // Limit each IP to 30 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
// app config
const config = require("./index");
// app routes
const routes = require("../routes");
// app middleware
const NotFoundMiddleware = require("../app/http/middleware/not-found");
const ErrorHandlerMiddleware = require("../app/http/middleware/error-handler");
// initialize express app
const app = express()
// set proxy
app.set("trust proxy", 1);

// compress all responses
app.use(compression());
// attach security middlewares
app.use(rateApiLimit);
// secure apps by setting various HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "daniolacorp.com", "azurewebsites.net"],
      "style-src": null,
    },
  })
);
// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.use(xss());
// for parsing application/json
app.use(express.json({limit: '50mb'}));
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// API router
app.use("/api/v1", routes);

// request user ip
app.get("/ip", (request, response) => response.send(request.ip));

// default routes fallback for routes
app.use(NotFoundMiddleware);
// error handler, send stacktrace only during development
app.use(ErrorHandlerMiddleware);

app.use(function (request, response, next) {
  // Website you wish to allow to connect
  response.setHeader("Access-Control-Allow-Origin", "*");

  // // Request methods you wish to allow
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // // Request headers you wish to allow
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
    "X-Requested-With,content-type"
  );
  response.setHeader("Content-Type", "application/json");
  // Pass to next layer of middleware
  next();
});

exports.app = app
exports.listRoutes = listEndpoints(app)