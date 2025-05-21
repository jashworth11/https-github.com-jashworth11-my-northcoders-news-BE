const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
const config = {};

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (ENV === "production") {
  config.user = process.env.PGUSER;
  config.password = process.env.PGPASSWORD;
  config.host = process.env.PGHOST;
  config.database = process.env.PGDATABASE;
  config.port = process.env.PORT;
}
if (!process.env.PGDATABASE) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

module.exports = new Pool(config);
