(function () {
  'use strict';

  var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Reporter = mongoose.model('Reporter'),
    _ = require('lodash');

  exports.create = function (req, res) {
    var reporter = new Reporter(req.body);

    reporter.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(reporter);
      }
    });
  };

  /**
   * Show the current Article sender
   */
  exports.read = function (req, res) {
    console.log('read');

    Reporter.findById(req.reporter._id).exec(function (err, reporter) {
      console.log(reporter);
      res.json(reporter);
    });
  };

  /**
   * Update a Article sender
   */
  exports.update = function (req, res) {
    var reporter = req.reporter;

    reporter = _.extend(reporter, req.body);
    reporter.save(function (err) {
      if (err) {
        return res.status(400).send({
          messeage: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(reporter);
      }
    });
  };

  /**
   * Delete an Article sender
   */
  exports.delete = function (req, res) {
    var reporter = req.reporter;

    reporter.remove(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(reporter);
      }
    });
  };

  /**
   * List of Article senders
   */
  exports.list = function (req, res) {
    Reporter.find().sort('-created').exec(function (err, reporters) {
      if (err) {
        return res.status(400).send({
          messeage: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(reporters);
      }
    });
  };

  exports.reporterByID = function (req, res, next, id) {
    Reporter.findById(id).exec(function (err, reporter) {
      if (err) return next(err);
      if (!reporter) return next(new Error('Failed to load reporter ' + id));

      req.reporter = reporter;
      next();
    });
  };
}());

