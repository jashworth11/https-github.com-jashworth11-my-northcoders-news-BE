const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });
if (ENV === "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not set in production");
  }
} else {
  if (!process.env.PGDATABASE) {
    throw new Error("No PGDATABASE configured for development");
  }
}

const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 2,
      }
    : {};

const db = new Pool(config);
module.exports = db;
