var Q = require('q');
var _ = require('lodash');
var AuthenticationContext = require('../node_modules/adal-angular/lib/adal.js');

var LOGIN = '/login.html';
var PAGE = '/page.html';
var AUTH_CONFIG = {
    tenant: '<YOUR TENANT ID>',
    clientId: '<YOUR CLIENT ID>',
    redirectUri: '<YOUR REDIRECT URI>',
    cacheLocation: 'sessionStorage'
  };
var loginButton = document.querySelector('.login-button');
var logoutButton = document.querySelector('.logout-button');


// set up logging for adal
window.Logging.level = 3;
window.Logging.log = window.console.log;

// initialize a new adal auth context
var authContext = new AuthenticationContext(AUTH_CONFIG);

authContext.handleWindowCallback();

// define a getToken function

function getToken() {
  return Q.promise(function(resolve, reject) {
    authContext.acquireToken(AUTH_CONFIG.clientId, function(err, token) {
      if (token) {
        resolve(token);
      } else {
        reject(err);
      }
    });
  });
}

// call the getToken function... print out the token if we have it, otherwise
// log the user in
getToken()
  .then(function(token) {
    console.log('token acquired for user, forwarding to internal page that requires auth...');
    if (!_.endsWith(window.location, PAGE)) {
      window.location = PAGE;
    }
  })
  .catch(function(err) {
    console.log('user not logged in, forwarding to login page...');
    if (!_.endsWith(window.location, LOGIN)) {
      window.location = LOGIN;
    }
  });

// if this is an authenticated page, call getToken every minute until it fails.
if (_.endsWith(window.location, PAGE)) {
  setInterval(function() {
    getToken()
      .then(function(token) {
        console.log('Token acquired!');
      });
  }, 60 * 1000);
}

// Bind the login button event listener
if (loginButton) {
  loginButton.addEventListener('click', function() {
    authContext.login();
  });
}

// Bind the logout button event listener
if (logoutButton) {
  logoutButton.addEventListener('click', function() {
    sessionStorage.clear();
    authContext.logOut();
  });
}
