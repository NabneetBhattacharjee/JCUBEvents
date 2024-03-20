import Joi from "joi";
import { config } from "dotenv";

/* Load env variables */
config();

/* Validation schema for the environment varibles */
const envSchema = Joi.object({
  // Determines the environment the application is running on
  NODE_ENV: Joi.string()
    .regex(new RegExp("^(development|production|staging|test)$"))
    .required(),

  // The PORT on which the server runs
  PORT: Joi.number().default(5000),

  // The URI string for database connection
  MONGO_URI: Joi.string().required(),

  // These are used application-wide to perform various actions
  APP_NAME: Joi.string().required(),
  APP_OWNER_CODE: Joi.string().required(),
  APP_PROTOCOL: Joi.string().default("http"),
  APP_HOSTNAME: Joi.string().default("localhost"),



  // Determines the salt rounds to use when hashing passwords/secrets
  SALT_ROUNDS: Joi.number().required(),

  // Determines the security for jsonwebtokens
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.number().default(86400000),
})
  .unknown()
  .required();

/* Extract validation results from Joi */
const { error, value: envVars } = envSchema.validate({ ...process.env });

/* Terminate the app if env variables are not defined */
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

/* Export the validated env variable values */
export default {
  node_env: envVars.NODE_ENV,

  port: envVars.PORT,

  mongo_uri: envVars.MONGO_URI,

  app: {
    name: envVars.APP_NAME,
    owner_code: envVars.APP_OWNER_CODE,
    domain: `${envVars.APP_PROTOCOL}://${envVars.APP_HOSTNAME}:${envVars.PORT}`,
  },

  // gmail: {
  //   username: envVars.GMAIL_USERNAME,
  //   password: envVars.GMAIL_PASSWORD,
  // },

  salt_rounds: envVars.SALT_ROUNDS,

  jwt: {
    secret: envVars.JWT_SECRET,
    expiry: envVars.JWT_EXPIRY,
  },
};
