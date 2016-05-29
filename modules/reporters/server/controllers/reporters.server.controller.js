'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reporter = mongoose.model('Reporter'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current reporter
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a Reporter
 */
exports.update = function (req, res) {
  var reporter = req.model;

  reporter.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(reporter);
  });
};

/**
 * Delete a Reporter
 */
exports.delete = function (req, res) {
  var reporter = req.model;

  reporter.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(reporter);
  });
};

/**
 * List of Reporters
 */
exports.list = function (req, res) {
  Reporter.find({}).sort('-created').exec(function (err, reporters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(reporters);
  });
};

/**
 * Reporter middleware
 */
exports.reporterByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  Reporter.findById(id).exec(function (err, reporter) {
    if (err) {
      return next(err);
    } else if (!reporter) {
      return next(new Error('Failed to load reporter ' + id));
    }

    req.model = reporter;
    next();
  });
};
