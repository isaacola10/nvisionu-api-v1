const Joi = require("joi")

require('dotenv').config()
// require and configure env
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  SERVER_PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
  JWT_LIFETIME: Joi.string().required().description('JWT ttl required to sign'),
  MONGO_HOST: Joi.string().required().description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
  MAILJET_SECRET_KEY: Joi.string().required().description('mailjet secret key is required'),
  MAILJET_API_KEY: Joi.string().required().description('mailjet api key is required'),
  MAIL_FROM_ADDRESS: Joi.string().required().description('mail from address is required').default('no-reply@daniola.io'),
  MAIL_SENDER_NAME: Joi.string().required().description('mail sender name is required').default('Daniola'),
}).unknown().required()

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwt: {
    secret: envVars.JWT_SECRET,
    lifetime: envVars.JWT_LIFETIME,
  },
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
  mailjet: {
    key: envVars.MAILJET_API_KEY,
    secret: envVars.MAILJET_SECRET_KEY
  },
  mail: {
    from: envVars.MAIL_FROM_ADDRESS,
    name: envVars.MAIL_SENDER_NAME,
  }
};