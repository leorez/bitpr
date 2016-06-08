'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MailinglistGroup = mongoose.model('MailinglistGroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an mailinglistGroup
 */
exports.create = function (req, res) {
  var mailinglistGroup = new MailinglistGroup(req.body);

  mailinglistGroup.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mailinglistGroup);
    }
  });
};

/**
 * Show the current mailinglistGroup
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var mailinglistGroup = req.mailinglistGroup ? req.mailinglistGroup.toJSON() : {};
  res.json(mailinglistGroup);
};

/**
 * Update an mailinglistGroup
 */
exports.update = function (req, res) {
  var mailinglistGroup = req.mailinglistGroup;

  mailinglistGroup.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mailinglistGroup);
    }
  });
};

/**
 * Delete an mailinglistGroup
 */
exports.delete = function (req, res) {
  var mailinglistGroup = req.mailinglistGroup;

  mailinglistGroup.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mailinglistGroup);
    }
  });
};

/**
 * List of MailinglistGroups
 */
exports.list = function (req, res) {
  MailinglistGroup.find().sort('-created').exec(function (err, mailinglistGroups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mailinglistGroups);
    }
  });
};

/**
 * MailinglistGroup middleware
 */
exports.mailinglistGroupByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'MailinglistGroup is invalid'
    });
  }

  MailinglistGroup.findById(id).exec(function (err, mailinglistGroup) {
    if (err) {
      return next(err);
    } else if (!mailinglistGroup) {
      return res.status(404).send({
        message: 'No mailinglistGroup with that identifier has been found'
      });
    }
    req.mailinglistGroup = mailinglistGroup;
    next();
  });
};

exports.mailinglistGroupByName = function (req, res, next, name) {

  MailinglistGroup.findOne({ name: name }).exec(function (err, mailinglistGroup) {
    if (err) {
      return next(err);
    } else if (!mailinglistGroup) {
      return res.status(404).send({
        message: 'No mailinglistGroup with that identifier has been found'
      });
    }
    req.mailinglistGroup = mailinglistGroup;
    next();
  });
};
