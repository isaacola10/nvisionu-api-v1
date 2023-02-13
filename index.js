// import config
const config = require('./config/index')
// import app instance
const { app } = require("./config/app")
global._appbase = __dirname

// Set app headers
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', '*');

  next();
})

// instantiate app
const start = async () => {
  try {
    // load database
    require('./config/mongoose');
    app.listen(config.port, () => console.log(`Server is listening on port ${config.port}...`));
  } catch (error) {
    console.log(error);
  }
};

// build and start the application
start();