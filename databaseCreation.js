// Allows the use of Pool provided from PG (allows multiple connections).
const { Pool } = require('pg');
// Allows the use of Secret .env variables.
const dotenv = require('dotenv');
// Allows the creation and deletion of databases via a command.
const pgtools = require('pgtools');
//
dotenv.config();

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
const pool = new Pool(config);


pool.on('connect', () => {
  console.log(`>>> Connected to: ${config.connectionString}`);
});

// ===============================================================
//                ---=== Create Local Database ===---
exports.createLocalDb = () => {
  pgtools.createdb(config, 'test-db', function (err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log(res);
  })
};

// ===============================================================
//                ---=== Drop Local Database ===---
exports.dropLocalDb = () => {
  pgtools.dropdb(config, 'test-db', function (err, res) {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    console.log(res);
  })
};

// ===============================================================
//                  ---=== Create Tables ===---
exports.createTableItems = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      items(
        id                  UUID              PRIMARY KEY,
        name                VARCHAR(128)      NOT NULL,
        image               VARCHAR(128)      NOT NULL,
        category            VARCHAR(128)      NOT NULL,
        value               INT               NOT NULL,
        created_date        TIMESTAMP,
        modified_date       TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop Tables
 */
exports.dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS items';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


require('make-runnable');
