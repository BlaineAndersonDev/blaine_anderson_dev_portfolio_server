// Implements Express
const express = require('express');
// Implements an Express Router called 'championRouter'
const championRouter = express.Router();
// Timestamp generator using the servers local time.
const moment = require('moment');
// Imports all custom _errorCatcher functions.
const errorCatcher = require('./_errorCatcher.js');
// PostgreSQL Database Connection Pool.
const db = require('../databaseConnection.js');

// ======================================
// Get all Champions.
// ROUTE: GET `api/champions/`
championRouter.get('/', (async (req, res, next) => {
  // Begin Database Query:
  db.query('\
      SELECT * \
      FROM champions'
    )
    .then(function (results) {
      // Return Status 200, errorCode & errorMessage if no 'champions' exist in Database:
      if (errorCatcher.isUndefinedNullEmpty(results.rows[0])) {
        return res.status(200).json({
          errorCode: `champion-0001e`,
          errorMessage: `No Champions exist.`
        });
      };
      // Return Status 200, message & resulting champions as a JSON object.
      return res.status(200).json({
        message: `API returned all Champions.`,
        results: results.rows
      });
    })
    .catch(function (err) {
      // Return Status 500, errorCode & errorMessage as a failsafe.
      return res.status(500).json({
        errorCode: `0000e`,
        errorMessage: `Unknown error.`,
        errorStack: err.stack
      });
    });
}));

// ======================================
// Get individual Champions.
// ROUTE: GET `api/champions/:champion_id`
championRouter.get('/:champion_id', (async (req, res, next) => {
  // Return Status 400, errorCode & errorMessage if 'params' do not contain the following:
  if (!errorCatcher.containsRequiredParams(req.params.champion_id)) { return res.status(400).json({ errorCode: `champion-0003e`, errorMessage: `Params must contain a champion_id.` }); };
  // Begin Database Query:
  await db.query('\
      SELECT * \
      FROM champions \
      WHERE champions.champion_id = $1 ;',
      [
        req.params.champion_id
      ]
    )
  .then(function (results) {
    // Return Status 200, errorCode & errorMessage if no specified 'champion' exists in Database:
    if (errorCatcher.isUndefinedNullEmpty(results.rows[0])) {
      return res.status(200).json({
        errorCode: `champion-0002e`,
        errorMessage: `No Champion with champion_id ${req.params.champion_id} exists.`
      });
    };
    // Return 200 Status, Message & Resulting champion as a JSON object.
    return res.status(200).json({
      message: `API returned Champion with champion_id of ${req.params.champion_id}.`,
      results: results.rows
    });
  })
  .catch(function (err) {
    // Return 500 Status & Message.
    return res.status(500).json({
      errorCode: `0000e`,
      errorMessage: `Unknown error.`,
      errorStack: err.stack
    });
  });
}));

// ======================================
// Create individual Champions.
// ROUTE: POST `api/champions/`
championRouter.post('/', (async(req, res, next) => {
  // Return Status 400, errorCode & errorMessage if 'body' does not contain the following:
  if (errorCatcher.containsRequiredBody(req.body.name)) { return res.status(400).json({ errorCode: `champion-0005e`, errorMessage: `Request body must contain name.` }); };
  if (errorCatcher.containsRequiredBody(req.body.image)) { return res.status(400).json({ errorCode: `champion-0006e`, errorMessage: `Request body must contain image.` }); };
  if (errorCatcher.containsRequiredBody(req.body.class)) { return res.status(400).json({ errorCode: `champion-0007e`, errorMessage: `Request body must contain name.` }); };
  if (errorCatcher.containsRequiredBody(req.body.gold)) { return res.status(400).json({ errorCode: `champion-0008e`, errorMessage: `Request body must contain gold.` }); };
  // Begin Database Query:
  await db.query(' \
    INSERT INTO champions \
      (name, image, class, gold, created_at, updated_at) \
    VALUES \
      ($1, $2, $3, $4, $5, $6) \
    RETURNING *',
    [
      req.body.name, req.body.image, req.body.class, req.body.gold, moment(), moment()
    ]
  )
  .then(function (results) {
    // Return 200 Status, Message & Resulting champion as a JSON object.
    return res.status(200).json({
      message: `API created & returned Champion with champion_id of ${results.rows[0].champion_id}.`,
      results: results.rows[0]
    });
  })
  .catch(function (err) {
    // Return 500 Status & Message.
    return res.status(500).json({
      errorCode: `0000e`,
      errorMessage: `Unknown error.`,
      errorStack: err.stack
    });
  });
}));

// ======================================
// Updates individual Champions.
// ROUTE: PUT `api/champions/:champion_id`
championRouter.put('/:champion_id', (async (req, res, next) => {
  // Return Status 400, errorCode & errorMessage if 'params' do not contain the following:
  if (!errorCatcher.containsRequiredParams(req.params.champion_id)) { return res.status(400).json({ errorCode: `champion-0003e`, errorMessage: `Params must contain a champion_id.` }); };
  // Return Status 400, errorCode & errorMessage if 'body' does not contain the following:
  if (errorCatcher.containsRequiredBody(req.body.name)) { return res.status(400).json({ errorCode: `champion-0005e`, errorMessage: `Request body must contain name.` }); };
  if (errorCatcher.containsRequiredBody(req.body.image)) { return res.status(400).json({ errorCode: `champion-0006e`, errorMessage: `Request body must contain image.` }); };
  if (errorCatcher.containsRequiredBody(req.body.class)) { return res.status(400).json({ errorCode: `champion-0007e`, errorMessage: `Request body must contain name.` }); };
  if (errorCatcher.containsRequiredBody(req.body.gold)) { return res.status(400).json({ errorCode: `champion-0008e`, errorMessage: `Request body must contain gold.` }); };

  // Begin Database Query:
  db.query(' \
    UPDATE champions \
    SET \
      name = $2, \
      image = $3, \
      class = $4, \
      gold = $5, \
      updated_at = $6 \
    WHERE champion_id = $1 \
    RETURNING *',
    [
      req.params.champion_id, req.body.name, req.body.image, req.body.class, req.body.gold, moment()
    ]
  )
  .then(function (results) {
    // Return 200 Status, Message & Resulting champion as a JSON object.
    return res.status(200).json({
      message: `API updated & returned Champion with champion_id of ${results.rows[0].champion_id}.`,
      results: results.rows[0]
    });
  })
  .catch(function (err) {
    // Return 500 Status & Message.
    return res.status(500).json({
      errorCode: `0000e`,
      errorMessage: `Unknown error.`,
      errorStack: err.stack
    });
  });
}));

// ======================================
// Deletes individual Champions.
// ROUTE: DELETE `api/champions/:champion_id`
championRouter.delete('/:champion_id', (async (req, res, next) => {
  // Return Status 400, errorCode & errorMessage if 'params' do not contain the following:
  if (errorCatcher.containsRequiredParams(req.params.champion_id)) { return res.status(400).json({ errorCode: `champion-0003e`, errorMessage: `Params must contain a champion_id.` }); };

  // Begin Database Query: (Check if champion exists)
  await db.query('\
      SELECT * \
      FROM champions \
      WHERE champions.champion_id = $1 ',
      [
        req.params.champion_id
      ]
    )
    .then(async function (results) {
      console.log(results.rows)
      // Return Status 500 & Message if 'champion_id' does not exist.
      if (errorCatcher.isUndefinedNullEmpty(results.rows[0])) {
        return res.status(500).json({
          message: `Champion with champion_id ${req.params.champion_id} does not exists.`
        });
      };

      // Begin Database Query:
      db.query(' \
        DELETE FROM champions \
        WHERE champion_id = $1',
        [
          req.params.champion_id
        ]
      )
      .then(function (results) {
        // Return 200 Status & Message.
        return res.status(200).json({
          message: `API deleted Champion with champion_id of ${req.params.champion_id}.`
        });
      })
      .catch(function (err) {
        // Return 500 Status & Message.
        return res.status(500).json({
          message: `API Deleted Champions with champion_id of ${req.params.champion_id} has failed.`
        });
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
module.exports = championRouter;
