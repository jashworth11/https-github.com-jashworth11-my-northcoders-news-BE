const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});
const config = {};
if (ENV === "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set in production");
  }
  config.connectionString = process.env.DATABASE_URL;
  config.ssl = { rejectUnauthorized: false };
  config.max = 2;
} else {
  if (!process.env.PGDATABASE) {
    throw new Error("No PGDATABASE configured for development");
  }
}

const db = new Pool(config);
console.log(`Connected to ${ENV} database`);
module.exports = db;
