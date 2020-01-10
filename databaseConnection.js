// Implements PostgreSQL.
const pg = require('pg');
// Allows databaseConnections.js to access our secret .env.
const dotenv = require('dotenv');
// Empty object to store our connection URL and use in our pool depending on ENV.
let config;

// Check what our ENV is and setup appropriately.
if (process.env.NODE_ENV === 'production') {
  // Forces PG to use SSL connections, allowing data transfer over hosts.
  pg.defaults.ssl = true;
  config = { connectionString: process.env.PORTFOLIO_DATABASE_URL };
} else {
  config = { connectionString: "postgresql://localhost/portfolio_development" };
};

console.log(config)
// Create 'Pool' and export it to our Routers.
const db = new pg.Pool(config);

module.exports = db;
