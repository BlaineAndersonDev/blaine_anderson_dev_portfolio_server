// ===============================================================
// This file is run from the terminal to migrate, seed, or destroy
// the given database.
//
// It can be run manually using these commands, but is setup with node scripts.
//      node databaseSetup generate
//      node databaseSetup seed
//      node databaseSetup destroy
//      NODE_ENV=production node databaseSetup generate
//      NODE_ENV=production node databaseSetup seed
//      NODE_ENV=production node databaseSetup destroy
// ===============================================================
// Allows the use of Pool provided from PG (allows multiple connections).
const pg = require('pg');
// Imports dotenv.
const dotenv = require('dotenv');
// Empty object to store our connection URL and use in our pool depending on ENV.
let config;
// Allows the use of Secret .env variables.
dotenv.config()

// Check what our ENV is and setup appropriately.
if (process.env.NODE_ENV === 'production') {
  // Forces PG to use SSL connections, allowing data transfer over hosts.
  // pg.defaults.ssl = true;
  console.log(process.env.PORTFOLIO_DATABASE_URL)
  config = { connectionString: process.env.PORTFOLIO_DATABASE_URL };
} else {
  config = { connectionString: "postgresql://localhost/portfolio_development" };
};

// Console log to display the connected database.
console.log(`>>> Connected to: ${config.connectionString}`);
// Created the actual connection to our Database.
const pool = new pg.Pool(config);

// On connection, will display a message in console showing where it connected to.
pool.on('connect', () => {
  // console.log(`>>> Connected to: ${config.connectionString}`);
});

// ===============================================================
// -----------------------=== Generate ===------------------------
// ===============================================================
  exports.generate = () => {
    console.log('>>> Generating migrations...')
    const queryText = (`
    CREATE TABLE IF NOT EXISTS items (
      item_id                      BIGSERIAL NOT NULL PRIMARY KEY,
      name                    VARCHAR(128) NOT NULL,
      image                   VARCHAR(128) NOT NULL,
      type                    VARCHAR(128) NOT NULL,
      value                   INT NOT NULL DEFAULT 0.0,
      created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS champions (
      champion_id                      BIGSERIAL NOT NULL PRIMARY KEY,
      name                    VARCHAR(128) NOT NULL,
      image                   VARCHAR(128) NOT NULL,
      class              VARCHAR(128) NOT NULL,
      gold                    INT NOT NULL DEFAULT 0.0,
      created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    `);
    pool.query(queryText)
      .then((res) => {
        console.log('>>> Generation Successful!')
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };

// ===============================================================
// -------------------------=== Seed ===--------------------------
// ===============================================================
  exports.seed = () => {
    console.log('>>> Seeding...')
    const queryText = (`
    INSERT INTO items (
      name, image, type, value
    ) VALUES (
      'Sword', 'http://u.cubeupload.com/WickedAmusingbus/Profile.png', 'Blade', 100.00
    );

    INSERT INTO champions (
      name, image, class, gold
    ) VALUES (
      'Shamino', 'http://u.cubeupload.com/WickedAmusingbus/ShaminoU7.png', 'Ranger', 15.00
    );
    INSERT INTO champions (
      name, image, class, gold
    ) VALUES (
      'Dupre', 'http://u.cubeupload.com/WickedAmusingbus/DupreU7.png', 'Knight', 135.00
    );
    INSERT INTO champions (
      name, image, class, gold
    ) VALUES (
      'Iolo', 'http://u.cubeupload.com/WickedAmusingbus/IoloU7.png', 'Bard', 67.00
    );
    `);
    pool.query(queryText)
      .then((res) => {
        console.log('>>> Seed Successful!')
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
  };

// ===============================================================
// -----------------------=== Destory ===-------------------------
// ===============================================================
exports.destroy = () => {
  console.log('>>> Destroying all migrations & seeds...')
  const queryText = (`
    DROP TABLE IF EXISTS items;
    DROP TABLE IF EXISTS champions;
  `);
  pool.query(queryText)
    .then((res) => {
      console.log('>>> Destruction Successful!')
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

// ===============================================================
// On connection end, will display a message in console showing where it was connected to, then exit the process.
pool.on('remove', () => {
  // console.log(`>>> Disconnected from: ${config.connectionString}`);
  process.exit(0);
});

// Exports all above functions, allowing them to be called in terminal.
require('make-runnable');
