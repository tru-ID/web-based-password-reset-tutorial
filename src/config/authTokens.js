// This will hold the users and authToken related to users
const authTokens = {};

function getAuthTokens() {
  return authTokens;
}

function getAuthToken(authToken) {
  return authTokens[authToken];
}

function setAuthTokens(newAuthTokens) {
  authTokens = newAuthTokens;
}

function setAuthToken(authToken, user) {
  authTokens[authToken] = user;
}

module.exports = {
  getAuthTokens,
  setAuthTokens,
  getAuthToken,
  setAuthToken
}