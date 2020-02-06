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
// Allows cross-origin resource sharing - https://www.npmjs.com/package/cors
const cors = require('cors')

// =====================================
// Initial Setup =======================
// =====================================
// Initialize the 'app' using 'express'.
const app = express();
// Use the provided PORT if it exists else default to PORT 5000.
const port = process.env.PORT || 5001;
// Prints the entire environment build in the console. Uncomment to display.
// console.log(process.env);
// Allows the app to parse 'application/json' request bodies.
app.use(express.json());
// Allows the app to parse 'x-ww-form-urlencoded' request bodies.
app.use(express.urlencoded({ extended: false }));
// Tells the app to use files in the Client's 'build' folder when rendering static pages (production pages).
app.use(express.static(path.join(__dirname, 'client/build')));
// Logs all HTTP actions to the console (Does not run during testing operations to prevent console spamming).
// if (!process.env.NODE_ENV === 'testing') {
  app.use(morgan(`:method :url {:status} {:response-time ms} {:date[clf]} {:res[content-length]}`))
// }
// Increase App API security by setting Headers using Helemt.
app.use(helmet())
//
app.use(cors())

// =====================================
// Database Setup ======================
// =====================================
// Activates the `databaseConnection` file which creates a consistant pool for our routers to connect to.
const databaseConnection = require('./databaseConnection.js');

// =====================================
// Router Setup ========================
// =====================================
// The app will use the required files below to generate API routes that allows the frontend to use HTTP calls (Axios) to retrieve data from the predetermined end points.
app.use('/api/items', require('./controllers/itemsController.js'));
app.use('/api/champions', require('./controllers/championsController.js'));
// const itemsController = require('./controllers/itemsController.js');
// app.use('/api/items', itemsController.itemRouter)

// ------------------------------------
// Test Route
// ROUTE: GET `/api/test`
app.get('/api/test', async (req, res, next) => {
  // Return HTTP status and JSON results object.
  return res.status(200).json({
    success: true,
    message: 'API returned Test Route successfully',
    results: ['Just','A','Simple','Test.']
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
