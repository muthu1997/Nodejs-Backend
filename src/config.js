/* eslint-disable no-unused-vars */
import path from "path";
import merge from "lodash/merge";

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error("You must set the " + name + " environment variable");
  }
  return process.env[name];
};

/* istanbul ignore next */
if (process.env.NODE_ENV !== "production" || process.env.NODE !== "/usr/bin/node") {
  const dotenv = require("dotenv-safe");
  dotenv.load({
    path: path.join(__dirname, "../.env"),
    sample: path.join(__dirname, "../.env"),
  });
}

const config = {
  all: {
    env: process.env.NODE_ENV || "development",
    root: path.join(__dirname, ".."),
    port: process.env.PORT || 3001,
    ip: process.env.IP || "0.0.0.0",
    apiRoot: process.env.API_ROOT || "",
    masterKey: requireProcessEnv("MASTER_KEY"),
    jwtSecret: requireProcessEnv("JWT_SECRET"),
    MAIL_ADDRESS: process.env.MAIL_ADDRESS,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_SECURE: process.env.MAIL_SECURE,
    API_URL: process.env.API_URL,
    DOMAIN_URL: process.env.DOMAIN_URL,
    mongo: {
      options: {},
    },
  },
  test: {},
  development: {
    mongo: {
      uri: requireProcessEnv("MONGO_CONNECTION_STRING"),
      options: {
        debug: false,
      },
    },
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 3001,
    mongo: {
      uri: process.env.MONGODB_URI || process.env.MONGO_CONNECTION_STRING,
    },
  },
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;