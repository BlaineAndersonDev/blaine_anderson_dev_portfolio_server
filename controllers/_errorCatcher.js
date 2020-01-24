function isUndefinedNullEmpty(results) {
  console.log(results)
  if (!results || results === undefined || results === null || results === '') {
    return true
  } else {
    return false
  }
};

function containsRequiredBody(body) {
  if (!body || body === undefined || body === null || body === '') {
    return true // If body DOES exist, return true.
  } else {
    return false // If body DOES NOT exist, return false.
  }
};

function containsRequiredParams(params) {
  if (!params || params === undefined || params === null || params === '') {
    return true // If params DO exist, return true.
  } else {
    return false // If params DO NOT exist, return false.
  }
};





function bodyContains(body) {
  if (!body || body === undefined || body === null || body === '') {
    return false // If body DOES NOT exist, return false.
  } else {
    return true // If body DOES exist, return true.
  }
};

function paramsContains(params) {
  if (!params || params === undefined || params === null || params === '') {
    return false // If params DO NOT exist, return false.
  } else {
    return true // If params DO exist, return true.
  }
};

function eventIntegerCheck(eventAnswer) {
  if (eventAnswer < 0 || eventAnswer > 5) {
    return false // If eventAnswer is BELOW the minimum value of 0 OR ABOVE the maximum value of 5, return false.
  } else {
    return true // If eventAnswer is between the acceptable parameters, return true.
  }
};

module.exports = {isUndefinedNullEmpty, containsRequiredBody, containsRequiredParams, bodyContains, paramsContains, eventIntegerCheck};
