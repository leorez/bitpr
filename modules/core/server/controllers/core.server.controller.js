'use strict';

var validator = require('validator'),
  errorHandler = require('./errors.server.controller.js'),
  schedule = require('./schedule.server.controller'),
  appRoot = require('app-root-path'),
  request = require('request'),
  EzDeferred = require('easy-deferred'),
  Deferred = require('deferred-js');

exports.images = function (req, res) {
  console.log(appRoot + '/uploads/images/3U3yQ_X-d_IGESG0hcTY7b2Y.jpeg');
  res.render(appRoot + '/uploads/images/3U3yQ_X-d_IGESG0hcTY7b2Y.jpeg');
};
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


exports.corpCodeToName = function (def, code) {
  // Dart OpenAPI test command
  // curl "http://dart.fss.or.kr/api/company.json?auth=8fe9565007f1da895e18858dda74b4ac56d77c58&crp_cd=005930"
  // dart open api key: 8fe9565007f1da895e18858dda74b4ac56d77c58

  console.log('code: ' + code);
  if (!code) def.reject('Error: code undefined');

  var url = 'http://dart.fss.or.kr/api/company.json?auth=8fe9565007f1da895e18858dda74b4ac56d77c58&crp_cd=' + code;
  request(url, function (error, response, body) {
    if (error) {
      def.reject(code);
    } else {
      console.log(body);
      var json = JSON.parse(body);
      if (json.err_code === '000')
        def.resolve(json.crp_nm_i);
      else
        def.reject(code);
    }
  });
};

exports.apiCorpCodeToName = function (req, res) {
  var corpCode = req.body.corpCode;
  var def = new EzDeferred();
  def.then(function (name) {
    console.log('Result=' + name);
    res.json({ name: name });
  }, function (error) {
    console.log('error ' + error);
    res.status(400).send({
      message: errorHandler.getErrorMessage(error)
    });
  });

  exports.corpCodeToName(def, corpCode);
};

function search(keyword, req, res) {
  Deferred.when(schedule.searchFromMedog(keyword)).then(function (result) {
    var data = JSON.parse(result).data;
    res.json(data);
  }, function (err) {
    console.log('err: ' + err);
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
}

exports.search = function (req, res) {
  var keyword = req.body.keyword;

  if (/[0-9]{6}$/.test(keyword)) {
    console.log('CORP_CODE=' + keyword);

    var def = new EzDeferred();
    def.then(function (name) {
      keyword = name;
      console.log('Result=' + keyword);
      search(keyword, req, res);
    }, function (error) {
      console.log('error ' + error);
      search(keyword, req, res);
    });

    exports.corpCodeToName(def, keyword);

  } else {
    search(keyword, req, res);
  }
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
