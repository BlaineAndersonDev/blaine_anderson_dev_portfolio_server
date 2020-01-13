// Allows the use of Pool provided from PG (allows multiple connections).
const { Pool } = require('pg');
// Allows the use of Secret .env variables.
const dotenv = require('dotenv');
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
  // console.log(`>>> Connected to: ${config.connectionString}`);
});

// ===============================================================
//                  ---=== Create Tables ===---
// node databaseCreation createTableItems
exports.createTableItems = () => {
  console.log('>>> Running createTableItems...')
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      items(
        id                  SERIAL PRIMARY KEY,
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

// ===============================================================
//                  ---=== Drop Tables ===---
// node databaseCreation dropTableItems
exports.dropTableItems = () => {
  console.log('>>> Running dropTableItems...')
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

// ===============================================================
//                  ---=== INSERT INTO ===---
// node databaseCreation insertTableItems
exports.insertTableItems = () => {
  console.log('>>> Running insertTableItems...')
  const queryText = `
      INSERT INTO items
      (id, name, image, category, value, created_date, modified_date)
      VALUES (
        1,
        'Blaine Anderson',
        'http://u.cubeupload.com/WickedAmusingbus/Profile.png',
        'person',
        1500.00,
        '2019-06-19T21:13:40.826Z',
        '2019-06-19T21:13:40.826Z'
      )
      RETURNING *`
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

// ===============================================================
//                  ---=== SELECT ===---
// node databaseCreation selectTableItems
exports.selectTableItems = () => {
  console.log('>>> Running selectTableItems...')
  const queryText = `\
    SELECT * \
    FROM items \
    RETURNING * \
    `;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

// ===============================================================
//                ---=== Command Sets ===---
// node databaseCreation generate
exports.generate = async () => {
  console.log('>>> Begin Generation...')
  await this.createTableItems()
  await this.insertTableItems()
  // await this.selectTableItems()
};

exports.destroy = async () => {
  await this.dropLocalDb()
};


// ===============================================================
pool.on('remove', () => {
  // console.log(`>>> Disconnected from: ${config.connectionString}`);
  process.exit(0);
});

require('make-runnable');
