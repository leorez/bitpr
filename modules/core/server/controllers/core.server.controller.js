'use strict';

var validator = require('validator'),
    errorHandler = require('./errors.server.controller.js'),
    schedule = require('./schedule.server.controller'),
    Deferred = require('deferred-js');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {

  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: safeUserObject
  });
};


var corpCodeToName = function(code) {
  return code;
};

exports.search = function(req, res) {
  var keyword = req.body.keyword;

  if(/[0-9]{6}$/.test(keyword)) {
    console.log('CORP_CODE='+keyword);
    keyword = corpCodeToName(keyword);
    console.log('Result='+keyword);
  }

  Deferred.when(schedule.searchFromMedog(keyword)).then(function(result) {
    var data = JSON.parse(result).data;
    res.json(data);
  }, function (err)  {
    console.log('err: '+err);
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
