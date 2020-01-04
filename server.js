// =====================================
// Base Imports ========================
// =====================================
// Allows use of backend routing - https://expressjs.com/
const express = require('express');
// Path allows our Server to find build files stored in our frontend - https://nodejs.org/api/path.html
const path = require('path');
// Date & Time Parser / Manipulator / Validator - https://momentjs.com/
const moment = require('moment');
// Helmet helps you secure your Express apps by setting various HTTP headers - https://helmetjs.github.io/
const helmet = require('helmet')
// HTTP request logger - https://github.com/expressjs/morgan
const morgan = require('morgan')

// =====================================
// Initial Setup =======================
// =====================================
// Initialize the 'app' using 'express'.
const app = express();
// Use the provided PORT if it exists else default to PORT 5000.
const port = process.env.PORT || 5000;
// Prints the entire environment build in the console. Uncomment to display.
// console.log(process.env);
// Allows the app to parse 'application/json' request bodies.
app.use(express.json());
// Allows the app to parse 'x-ww-form-urlencoded' request bodies.
app.use(express.urlencoded({ extended: false }));
// Tells the app to use files in the Client's 'build' folder when rendering static pages (production pages).
app.use(express.static(path.join(__dirname, 'client/build')));
// Logs all HTTP actions to the console (Only runs in 'development').
// if (process.env.NODE_ENV === 'development') {
  app.use(morgan(':method :url {HTTP Status: :status} {Content Length: :res[content-length]} {Response Time: :response-time ms}'))
// }
// Increase App API security by setting Headers using Helemt.
app.use(helmet())

// =====================================
// Router Setup ========================
// =====================================
// The app will use the required files below to generate API routes that allows the frontend to use HTTP calls (Axios) to retrieve data from the predetermined end points.
// app.use('/api/users', require('./controllers/usersController.js'));

// ------------------------------------
// Test Route
// ROUTE: GET `/api/test/`
app.get('/api/test', async (req, res, next) => {
  // Basic Object to return to ensure connection is functional.
  const helloWorld = [ {id: 1, message: 'Hello World!'}, {id: 2, message: 'Connection is functional.'} ]

  // Return HTTP status and JSON results object.
  return res.status(200).json({
    success: true,
    message: 'API returned test successfully',
    results: helloWorld
  });
});

// =====================================
// Retrieve the local IP ===============
// =====================================
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
  for (var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
      addresses.push(address.address);
    }
  }
};

// =====================================
// Error Handling ======================
// =====================================
// Gets called because of `errorWrapper.js` in the controllers directory.
// End all function for all errors.
app.use(function(err, req, res, next) {
  // Example of specific error handling. Currently unused.
    // if (error instanceof ReferenceError) {}
  if (process.env.NODE_ENV === 'production') {
    res.status(500)
  } else {
    if (!err.name) {
      res.status(500).json({
        success: false,
        name: 'Blank Error',
        message: 'If this error is displayed, then you likely used `next()` without specifiying anything.'
      });
    } else {
      // Check for test ENV. If true then output only JSON.
      if (process.env.NODE_ENV === 'test') {
        res.status(500).json({
          success: false,
          name: err.name,
          message: err.message
        });
      } else {
        console.log('=================================');
        console.log('========= ERROR RESULTS =========');
        console.log('---------------------------------');
        console.log(err.name);
        console.log(err.message);
        console.log('=================================');
        // console.log(err.stack);
        res.status(500).json({
          success: false,
          name: err.name,
          message: err.message
        });
      };
    };
  };
});

// =====================================
// Final Steps =========================
// =====================================
// Display to show the Node Enviornment and inform the developer what port the API is listening on.
console.log('===============================')
console.log('API successfully loaded.')
console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
console.log('Test functionality with POSTman using the following route:')
console.log(`      ${addresses[0]}:${port}/api/test`)
console.log(`Listening on port: ${port}`)
console.log('===============================')

// Sets the API to listen for calls.
app.listen(port);

// Exports the `app` to be used elsewhere in the project.
module.exports = app
