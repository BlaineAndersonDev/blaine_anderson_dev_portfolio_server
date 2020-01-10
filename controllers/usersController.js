// Implements Express
const express = require('express');
// Implements an Express Router called 'userRouter'
const userRouter = express.Router();
// Timestamp generator using the servers local time.
const moment = require('moment');
// Imports all custom _errorCatcher functions.
const errorCatcher = require('./_errorCatcher.js');
// PostgreSQL Database Connection Pool.
const db = require('../db/databaseConnection.js');
// ---=== Child controllers ===---
const partnersController = require('./partnersController.js');

// ======================================
// Get individual User.
// ROUTE: GET `api/users/`
userRouter.get('/:user_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.user_id)) { return res.status(400).json({ message: "Params must contain user_id." }); };

  // PG database query.
  db.query('\
      SELECT * \
      FROM users \
      WHERE users.user_id = $1 ',
      [
        req.params.user_id
      ]
    )
    .then(function (results) {
      // Return Status 500 & Message if 'user' does not exist:
      if (!errorCatcher.userExists(results.rows[0])) { return res.status(500).json({ message: `User with provided user_id: ${req.params.user_id} does not exist.` }); };

      // Return 200 Status, Message & Resulting user as a JSON object.
      return res.status(200).json({
        message: `API returned User with user_id of ${req.params.user_id}.`,
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
// Create individual User.
// ROUTE: POST `api/users/`
userRouter.post('/', (async(req, res, next) => {
  // Return Status 400 & Message if 'body' does not contain the following:
  if (!errorCatcher.bodyContains(req.body.user_id)) { return res.status(400).json({ message: "Body must contain user_id." }); };
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

  // PG database query.
  await db.query('\
      SELECT * \
      FROM users \
      WHERE users.user_id = $1 ',
      [
        req.body.user_id
      ]
    )
    .then(async function (results) {
      // Return Status 500 & Message if 'user_id' already exists.
      if (errorCatcher.undefinedNullEmptyCheck(results.rows[0])) { return res.status(500).json({ message: `User with provided user_id ${req.body.user_id} already exists.` }); };

      // PG database query.
      await db.query(' \
        INSERT INTO users \
        (user_id, gender, birthdate, name, premium, agreed_to_terms, opt_in_to_marketing, profile_answer_1, profile_answer_2, profile_answer_3, profile_answer_4, profile_answer_5, profile_answer_6, profile_answer_7, profile_answer_8, profile_answer_9, profile_answer_10, profile_answer_11, profile_answer_12, created_at, updated_at) \
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) \
        RETURNING *',
        [
          req.body.user_id, req.body.gender, req.body.birthdate, req.body.name, req.body.premium, req.body.agreed_to_terms, req.body.opt_in_to_marketing, req.body.profile_answer_1, req.body.profile_answer_2, req.body.profile_answer_3, req.body.profile_answer_4, req.body.profile_answer_5, req.body.profile_answer_6, req.body.profile_answer_7, req.body.profile_answer_8, req.body.profile_answer_9, req.body.profile_answer_10, req.body.profile_answer_11, req.body.profile_answer_12, moment(), moment()
        ]
      )
      .then(function (results) {
        // Return 200 Status, Message & Resulting user as a JSON object.
        return res.status(200).json({
          message: `API returned newly created User with user_id of ${results.rows[0].user_id}.`,
          results: results.rows[0]
        });
      })
      .catch(function (err) {
        // Return 500 Status & Message.
        return res.status(500).json({
          message: err.stack
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
// Updates individual User.
// ROUTE: PUT `api/users/:user_id`
userRouter.put('/:user_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.user_id)) { return res.status(400).json({ message: "Params must contain user_id." }); };
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

  // PG database query.
  db.query(' \
    UPDATE users \
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
    WHERE user_id = $1 \
    RETURNING *',
    [
      req.params.user_id, req.body.gender, req.body.birthdate, req.body.name, req.body.premium, req.body.agreed_to_terms, req.body.opt_in_to_marketing, req.body.profile_answer_1, req.body.profile_answer_2, req.body.profile_answer_3, req.body.profile_answer_4, req.body.profile_answer_5, req.body.profile_answer_6, req.body.profile_answer_7, req.body.profile_answer_8, req.body.profile_answer_9, req.body.profile_answer_10, req.body.profile_answer_11, req.body.profile_answer_12, moment()
    ]
  )
  .then(function (results) {
    // Return 200 Status, Message & Resulting user as a JSON object.
    return res.status(200).json({
      message: `API returned Updated User with user_id of ${results.rows[0].user_id}.`,
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
// Deletes individual User.
// ROUTE: DELETE `api/users/:user_id`
userRouter.delete('/:user_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.user_id)) { return res.status(400).json({ message: "Params must contain user_id." }); };

  // PG database query.
  db.query(' \
    DELETE FROM users \
    WHERE user_id = $1',
    [
      req.body.user_id
    ]
  )
  .then(function (results) {
    // Return 200 Status & Message.
    return res.status(200).json({
      message: `API Deleted User with user_id of ${req.params.user_id}.`
    });
  })
  .catch(function (err) {
    // Return 500 Status & Message.
    return res.status(500).json({
      message: `API Deleted User with user_id of ${req.params.user_id} has failed.`
    });
  });
}));

// ======================================
// Passing onto child routers ===========
// ======================================
// This allows the usersRouter to send requests involving Partners to the partner Controller along with all the required information (i.e. params, body, etc).
  // NOTE: For ALL child routes we require the param of 'user_id' in these function, and it will not be passed as a param to any functions in the following router (i.e. the partnersController).
  // This means we will have to send it manually as it's own variable. (i.e. req.user_id).
// --------------------------------------
userRouter.use('/:user_id/partners', function(req, res, next) {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.user_id)) { return res.status(400).json({ message: "Params must contain user_id." }); };
  // Set user_id into req directly as it will not be passed as a param.
  req.user_id = req.params.user_id;
  // Continue onto the specified partnersController.js route.
  next()
}, partnersController);

// ======================================
// ROUTING EXCEPTIONS ===================
// ======================================
// Routes here cannot be properly fitted into the normal ExpressJS CRUD routing flow due to routing restraints and must be run from users instead.
// --------------------------------------
// Route Reason: As all other events routes are child routes of partners, and this route explicitly does not require a partnerId, it has to be run from users directly.
// Get all Events of user_id.
// ROUTE: GET `api/users/:user_id/events/`
userRouter.get('/:user_id/events', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.user_id)) { return res.status(400).json({ message: "Params must contain user_id." }); };

  // PG database query.
  db.query(' \
    SELECT * \
    FROM events \
    WHERE user_id = $1 \
    ORDER BY event_id ASC',
    [
      req.params.user_id
    ]
  )
  .then(function (results) {
    // Return Status 500 & Message if 'user' contains no 'events'.
    if (!errorCatcher.undefinedNullEmptyCheck(results.rows[0])) { return res.status(500).json({ message: "User with provided user_id " + req.params.user_id + " contains no Events." }); };

    // Return 200 Status & Message.
    return res.status(200).json({
      message: 'API returned list of all Events for user_id ' + req.params.user_id,
      results: results.rows
    });
  })
  .catch(function (err) {
    // Return 500 Status & Message.
    return res.status(500).json({
      message: 'API lookup of events for user_id ' + req.params.user_id + ' has failed.'
    });
  });
}));

// ======================================
module.exports = userRouter;
