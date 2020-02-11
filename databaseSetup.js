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
      item_id                 BIGSERIAL NOT NULL PRIMARY KEY,
      name                    VARCHAR(128) NOT NULL,
      image            VARCHAR(128) NOT NULL,
      type                    VARCHAR(128) NOT NULL,
      value                   INT NOT NULL DEFAULT 0.0,
      created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS champions (
      champion_id             BIGSERIAL NOT NULL PRIMARY KEY,
      name                    VARCHAR(128) NOT NULL,
      square_image            VARCHAR(128) NOT NULL,
      splash_image            VARCHAR(128) NOT NULL,
      class                   VARCHAR(128) NOT NULL,
      gold                    INT NOT NULL DEFAULT 0.0,
      created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS champion_portraits (
      champion_portrait_id    BIGSERIAL NOT NULL PRIMARY KEY,
      name                    VARCHAR(128) NOT NULL,
      square_url              VARCHAR(128) NOT NULL,
      splash_url              VARCHAR(128) NOT NULL,
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
      name, square_image, splash_image, class, gold
    ) VALUES (
      'Akali', 'https://i.imgur.com/IuuX2cw.png', 'https://i.imgur.com/YKEqyYe.jpg', 'Assassin', 500.00
    );
    INSERT INTO champions (
      name, square_image, splash_image, class, gold
    ) VALUES (
      'Ahri', 'https://i.imgur.com/cvy0q9O.png', 'https://i.imgur.com/WvK8XeH.jpg', 'Mage', 500.00
    );

    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Akali',
      'https://i.imgur.com/IuuX2cw.png',
      'https://i.imgur.com/YKEqyYe.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Ahri',
      'https://i.imgur.com/cvy0q9O.png',
      'https://i.imgur.com/WvK8XeH.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Ashe',
      'https://i.imgur.com/X5Rzr3Q.png',
      'https://i.imgur.com/DIR8JZk.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Alistar',
      'https://i.imgur.com/eKQLDGs.png',
      'https://i.imgur.com/mDBZCAb.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Anivia',
      'https://i.imgur.com/Kf902nP.png',
      'https://i.imgur.com/pbJwjFI.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Aphelios',
      'https://i.imgur.com/ikvALBU.png',
      'https://i.imgur.com/PMtRrPt.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Azir',
      'https://i.imgur.com/rdjUkMy.png',
      'https://i.imgur.com/3NMdMXd.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Amumu',
      'https://i.imgur.com/5dbXqhI.png',
      'https://i.imgur.com/2HT4lmY.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Aurelion Sol',
      'https://i.imgur.com/Il36n2h.png',
      'https://i.imgur.com/ZkM9DBZ.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Annie',
      'https://i.imgur.com/0ZstpA9.png',
      'https://i.imgur.com/ck25DS8.jpg'
    );
    INSERT INTO champion_portraits (
      name, square_url, splash_url
    ) VALUES (
      'Aatrox',
      'https://i.imgur.com/BMHQllK.png',
      'https://i.imgur.com/StxUkFS.jpg'
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
    DROP TABLE IF EXISTS champion_portraits;
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
