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
  // PG database query.
  db.query('\
      SELECT * \
      FROM champions'
    )
    .then(function (results) {
      // Return Status 500 & Message if 'champion' does not exist:
      if (!errorCatcher.undefinedNullEmptyCheck(results.rows[0])) { return res.status(500).json({ message: `Champions do not exist.` }); };

      // Return 200 Status, Message & Resulting champion as a JSON object.
      return res.status(200).json({
        message: `API returned all Champions.`,
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
// Get individual Champions.
// ROUTE: GET `api/champions/`
championRouter.get('/:champion_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.champion_id)) { return res.status(400).json({ message: "Params must contain champion_id." }); };

  // PG database query.
  await db.query('\
      SELECT * \
      FROM champions \
      WHERE champions.champion_id = $1 ;',
      [
        req.params.champion_id
      ]
    )
  .then(function (results) {
    // Return Status 500 & Message if 'champion' does not exist:
    if (!errorCatcher.undefinedNullEmptyCheck(results.rows[0])) { return res.status(500).json({ message: `Champions with provided champion_id: ${req.params.champion_id} does not exist.` }); };

    // Return 200 Status, Message & Resulting champion as a JSON object.
    return res.status(200).json({
      message: `API returned Champions with champion_id of ${req.params.champion_id}.`,
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
// Create individual Champions.
// ROUTE: POST `api/champions/`
championRouter.post('/', (async(req, res, next) => {
  // Return Status 400 & Message if 'body' does not contain the following:
  // if (!errorCatcher.bodyContains(req.body.champion_id)) { return res.status(400).json({ message: "Body must contain champion_id." }); };
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

  // PG database query.
  // await db.query('\
  //     SELECT * \
  //     FROM champions \
  //     WHERE champions.champion_id = $1 ',
  //     [
  //       req.body.champion_id
  //     ]
  //   )
  //   .then(async function (results) {
  //     // Return Status 500 & Message if 'champion_id' already exists.
  //     if (errorCatcher.undefinedNullEmptyCheck(results.rows[0])) { return res.status(500).json({ message: `Champions with provided champion_id ${req.body.champion_id} already exists.` }); };

      // PG database query.
      await db.query(' \
        INSERT INTO champions \
        (name, image, category, value, created_date, modified_date) \
        VALUES ($1, $2, $3, $4, $5, $6) \
        RETURNING *',
        [
          req.body.name, req.body.image, req.body.category, req.body.value, moment(), moment()
        ]
      )
      .then(function (results) {
        // Return 200 Status, Message & Resulting champion as a JSON object.
        return res.status(200).json({
          message: `API returned newly created Champions with champion_id of ${results.rows[0].champion_id}.`,
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
// Updates individual Champions.
// ROUTE: PUT `api/champions/:champion_id`
championRouter.put('/:champion_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.champion_id)) { return res.status(400).json({ message: "Params must contain champion_id." }); };
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
    UPDATE champions \
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
    WHERE champion_id = $1 \
    RETURNING *',
    [
      req.params.champion_id, req.body.gender, req.body.birthdate, req.body.name, req.body.premium, req.body.agreed_to_terms, req.body.opt_in_to_marketing, req.body.profile_answer_1, req.body.profile_answer_2, req.body.profile_answer_3, req.body.profile_answer_4, req.body.profile_answer_5, req.body.profile_answer_6, req.body.profile_answer_7, req.body.profile_answer_8, req.body.profile_answer_9, req.body.profile_answer_10, req.body.profile_answer_11, req.body.profile_answer_12, moment()
    ]
  )
  .then(function (results) {
    // Return 200 Status, Message & Resulting champion as a JSON object.
    return res.status(200).json({
      message: `API returned Updated Champions with champion_id of ${results.rows[0].champion_id}.`,
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
// Deletes individual Champions.
// ROUTE: DELETE `api/champions/:champion_id`
championRouter.delete('/:champion_id', (async (req, res, next) => {
  // Return Status 400 & Message if 'params' do not contain the following:
  if (!errorCatcher.paramsContains(req.params.champion_id)) { return res.status(400).json({ message: "Params must contain champion_id." }); };

  // PG database query.
  db.query(' \
    DELETE FROM champions \
    WHERE champion_id = $1',
    [
      req.body.champion_id
    ]
  )
  .then(function (results) {
    // Return 200 Status & Message.
    return res.status(200).json({
      message: `API Deleted Champions with champion_id of ${req.params.champion_id}.`
    });
  })
  .catch(function (err) {
    // Return 500 Status & Message.
    return res.status(500).json({
      message: `API Deleted Champions with champion_id of ${req.params.champion_id} has failed.`
    });
  });
}));

// ======================================
module.exports = championRouter;
