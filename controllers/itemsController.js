// Implements Express
const express = require('express');
// Implements an Express Router called 'itemRouter'
const itemRouter = express.Router();
// Timestamp generator using the servers local time.
const moment = require('moment');
// Imports all custom _errorCatcher functions.
const errorCatcher = require('./_errorCatcher.js');
// PostgreSQL Database Connection Pool.
const db = require('../databaseConnection.js');

// ======================================
// Get all Items.
// ROUTE: GET `api/items/`
itemRouter.get('/', (async (req, res, next) => {
  // Begin Database Query:
  db.query('\
      SELECT * \
      FROM items'
    )
    .then(function (results) {
      console.log(results.rows)
      // Return Status 500 & Message if 'item' does not exist:
      if (!errorCatcher.isUndefinedNullEmpty(results.rows[0])) { return res.status(500).json({ message: `Items do not exist.` }); };

      // Return 200 Status, Message & Resulting item as a JSON object.
      return res.status(200).json({
        message: `API returned Items with item_id of ${req.params.item_id}.`,
        results: results.rows
      });
    })
    .catch(function (err) {
      // Return 500 Status & Message.
      return res.status(500).json({
        // message: err.stack
        message: 'There was an error. Please report this to the API Developer.'
      });
    });
}));

// ======================================
// Get individual Items.
// ROUTE: GET `api/items/`
itemRouter.get('/:item_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.item_id)) { return res.status(400).json({ message: "Params must contain item_id." }); };

  // Begin Database Query:
  db.query('\
      SELECT * \
      FROM items \
      WHERE items.item_id = $1 ',
      [
        req.params.item_id
      ]
    )
    .then(function (results) {
      // Return Status 500 & Message if 'item' does not exist:
      if (!errorCatcher.itemExists(results.rows[0])) { return res.status(500).json({ message: `Items with provided item_id: ${req.params.item_id} does not exist.` }); };

      // Return 200 Status, Message & Resulting item as a JSON object.
      return res.status(200).json({
        message: `API returned Items with item_id of ${req.params.item_id}.`,
        results: results.rows[0]
      });
    })
    .catch(function (err) {
      // Return 500 Status & Message.
      return res.status(500).json({
        // message: err.stack
        message: 'There was an error. Please report this to the API Developer.'
      });
    });
}));

// ======================================
// Create individual Items.
// ROUTE: POST `api/items/`
itemRouter.post('/', (async(req, res, next) => {
  // Return Status 400 & Message if 'body' does not contain the following:
  // if (!errorCatcher.bodyContains(req.body.item_id)) { return res.status(400).json({ message: "Body must contain item_id." }); };
  // if (!errorCatcher.bodyContains(req.body.gender)) { return res.status(400).json({ message: "Body must contain gender." }); };
  // if (!errorCatcher.bodyContains(req.body.birthdate)) { return res.status(400).json({ message: "Body must contain birthdate." }); };
  // if (!errorCatcher.bodyContains(req.body.name)) { return res.status(400).json({ message: "Body must contain name." }); };
  // if (!errorCatcher.bodyContains(req.body.premium)) { return res.status(400).json({ message: "Body must contain premium." }); };
  // if (!errorCatcher.bodyContains(req.body.agreed_to_terms)) { return res.status(400).json({ message: "Body must contain agreed_to_terms." }); };
  // if (!errorCatcher.bodyContains(req.body.opt_in_to_marketing)) { return res.status(400).json({ message: "Body must contain opt_in_to_marketing." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_1)) { return res.status(400).json({ message: "Body must contain profile_answer_1." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_2)) { return res.status(400).json({ message: "Body must contain profile_answer_2." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_3)) { return res.status(400).json({ message: "Body must contain profile_answer_3." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_4)) { return res.status(400).json({ message: "Body must contain profile_answer_4." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_5)) { return res.status(400).json({ message: "Body must contain profile_answer_5." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_6)) { return res.status(400).json({ message: "Body must contain profile_answer_6." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_7)) { return res.status(400).json({ message: "Body must contain profile_answer_7." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_8)) { return res.status(400).json({ message: "Body must contain profile_answer_8." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_9)) { return res.status(400).json({ message: "Body must contain profile_answer_9." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_10)) { return res.status(400).json({ message: "Body must contain profile_answer_10." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_11)) { return res.status(400).json({ message: "Body must contain profile_answer_11." }); };
  // if (!errorCatcher.bodyContains(req.body.profile_answer_12)) { return res.status(400).json({ message: "Body must contain profile_answer_12." }); };

  // Begin Database Query:
  // await db.query('\
  //     SELECT * \
  //     FROM items \
  //     WHERE items.item_id = $1 ',
  //     [
  //       req.body.item_id
  //     ]
  //   )
  //   .then(async function (results) {
  //     // Return Status 500 & Message if 'item_id' already exists.
  //     if (errorCatcher.isUndefinedNullEmpty(results.rows[0])) { return res.status(500).json({ message: `Items with provided item_id ${req.body.item_id} already exists.` }); };

      // Begin Database Query:
      await db.query(' \
        INSERT INTO items \
        (name, image, category, value, created_date, modified_date) \
        VALUES ($1, $2, $3, $4, $5, $6) \
        RETURNING *',
        [
          req.body.name, req.body.image, req.body.category, req.body.value, moment(), moment()
        ]
      )
      .then(function (results) {
        // Return 200 Status, Message & Resulting item as a JSON object.
        return res.status(200).json({
          message: `API returned newly created Items with item_id of ${results.rows[0].item_id}.`,
          results: results.rows[0]
        });
      })
      .catch(function (err) {
        // Return 500 Status & Message.
        return res.status(500).json({
          message: err.stack
        });
      });
    // })
    // .catch(function (err) {
    //   // Return 500 Status & Message.
    //   return res.status(500).json({
    //     message: err.stack
    //   });
    // });
}));

// ======================================
// Updates individual Items.
// ROUTE: PUT `api/items/:item_id`
itemRouter.put('/:item_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.item_id)) { return res.status(400).json({ message: "Params must contain item_id." }); };
  // Return Status 400 & Message if 'body' does not contain the following:
  if (!errorCatcher.bodyContains(req.body.gender)) { return res.status(400).json({ message: "Body must contain gender." }); };
  if (!errorCatcher.bodyContains(req.body.birthdate)) { return res.status(400).json({ message: "Body must contain birthdate." }); };
  if (!errorCatcher.bodyContains(req.body.name)) { return res.status(400).json({ message: "Body must contain name." }); };
  if (!errorCatcher.bodyContains(req.body.premium)) { return res.status(400).json({ message: "Body must contain premium." }); };
  if (!errorCatcher.bodyContains(req.body.agreed_to_terms)) { return res.status(400).json({ message: "Body must contain agreed_to_terms." }); };
  if (!errorCatcher.bodyContains(req.body.opt_in_to_marketing)) { return res.status(400).json({ message: "Body must contain opt_in_to_marketing." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_1)) { return res.status(400).json({ message: "Body must contain profile_answer_1." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_2)) { return res.status(400).json({ message: "Body must contain profile_answer_2." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_3)) { return res.status(400).json({ message: "Body must contain profile_answer_3." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_4)) { return res.status(400).json({ message: "Body must contain profile_answer_4." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_5)) { return res.status(400).json({ message: "Body must contain profile_answer_5." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_6)) { return res.status(400).json({ message: "Body must contain profile_answer_6." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_7)) { return res.status(400).json({ message: "Body must contain profile_answer_7." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_8)) { return res.status(400).json({ message: "Body must contain profile_answer_8." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_9)) { return res.status(400).json({ message: "Body must contain profile_answer_9." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_10)) { return res.status(400).json({ message: "Body must contain profile_answer_10." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_11)) { return res.status(400).json({ message: "Body must contain profile_answer_11." }); };
  if (!errorCatcher.bodyContains(req.body.profile_answer_12)) { return res.status(400).json({ message: "Body must contain profile_answer_12." }); };

  // Begin Database Query:
  db.query(' \
    UPDATE items \
    SET \
      gender = $2, \
      birthdate = $3, \
      name = $4, \
      premium = $5, \
      agreed_to_terms = $6, \
      opt_in_to_marketing = $7, \
      profile_answer_1 = $8, \
      profile_answer_2 = $9, \
      profile_answer_3 = $10, \
      profile_answer_4 = $11, \
      profile_answer_5 = $12, \
      profile_answer_6 = $13, \
      profile_answer_7 = $14, \
      profile_answer_8 = $15, \
      profile_answer_9 = $16, \
      profile_answer_10 = $17, \
      profile_answer_11 = $18, \
      profile_answer_12 = $19, \
      updated_at = $20 \
    WHERE item_id = $1 \
    RETURNING *',
    [
      req.params.item_id, req.body.gender, req.body.birthdate, req.body.name, req.body.premium, req.body.agreed_to_terms, req.body.opt_in_to_marketing, req.body.profile_answer_1, req.body.profile_answer_2, req.body.profile_answer_3, req.body.profile_answer_4, req.body.profile_answer_5, req.body.profile_answer_6, req.body.profile_answer_7, req.body.profile_answer_8, req.body.profile_answer_9, req.body.profile_answer_10, req.body.profile_answer_11, req.body.profile_answer_12, moment()
    ]
  )
  .then(function (results) {
    // Return 200 Status, Message & Resulting item as a JSON object.
    return res.status(200).json({
      message: `API returned Updated Items with item_id of ${results.rows[0].item_id}.`,
      results: results.rows[0]
    });
  })
  .catch(function (err) {
    // Return 500 Status & Message.
    return res.status(500).json({
      message: err.stack
    });
  });
}));

// ======================================
// Deletes individual Items.
// ROUTE: DELETE `api/items/:item_id`
itemRouter.delete('/:item_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.item_id)) { return res.status(400).json({ message: "Params must contain item_id." }); };

  // Begin Database Query:
  db.query(' \
    DELETE FROM items \
    WHERE item_id = $1',
    [
      req.body.item_id
    ]
  )
  .then(function (results) {
    // Return 200 Status & Message.
    return res.status(200).json({
      message: `API Deleted Items with item_id of ${req.params.item_id}.`
    });
  })
  .catch(function (err) {
    // Return 500 Status & Message.
    return res.status(500).json({
      message: `API Deleted Items with item_id of ${req.params.item_id} has failed.`
    });
  });
}));

// ======================================
module.exports = itemRouter;
