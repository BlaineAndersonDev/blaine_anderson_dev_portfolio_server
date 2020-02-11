// Implements Express
const express = require('express');
// Implements an Express Router called 'championPortraitsRouter'
const championPortraitsRouter = express.Router();
// Timestamp generator using the servers local time.
const moment = require('moment');
// Imports all custom _errorCatcher functions.
const errorCatcher = require('./_errorCatcher.js');
// PostgreSQL Database Connection Pool.
const db = require('../databaseConnection.js');

// ======================================
// Get all Champion Portraits.
// ROUTE: GET `api/championPortraits/`
championPortraitsRouter.get('/', (async (req, res, next) => {
  // Begin Database Query:
  db.query('\
      SELECT * \
      FROM champion_portraits'
    )
    .then(function (results) {
      // Return Status 200, errorCode & errorMessage if no 'champions' exist in Database:
      if (errorCatcher.isUndefinedNullEmpty(results.rows[0])) {
        return res.status(200).json({
          errorCode: `champion-0001e`,
          errorMessage: `No Champion Portraits exist.`
        });
      };
      // Return Status 200, message & resulting champions as a JSON object.
      return res.status(200).json({
        message: `API returned all Champion Portraits.`,
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
module.exports = championPortraitsRouter;
