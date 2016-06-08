'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mailinglist = mongoose.model('Mailinglist'),
  mailinglistGroupController = require(path.resolve('./modules/mailinglist/server/controllers/mailinglist-group.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an mailinglist
 */
exports.create = function (req, res) {
  var next = function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    var mailinglist = new Mailinglist(req.body);
    mailinglist.group = req.mailinglistGroup._id;

    mailinglist.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(mailinglist);
      }
    });
  };

  console.log('body: ' + JSON.stringify(req.body));
  mailinglistGroupController.mailinglistGroupByName(req, res, next, req.body.group);
};

/**
 * Show the current mailinglist
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var mailinglist = req.mailinglist ? req.mailinglist.toJSON() : {};
  res.json(mailinglist);
};

/**
 * Update an mailinglist
 */
exports.update = function (req, res) {
  var mailinglist = req.mailinglist;

  mailinglist.title = req.body.title;
  mailinglist.content = req.body.content;

  mailinglist.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mailinglist);
    }
  });
};

/**
 * Delete an mailinglist
 */
exports.delete = function (req, res) {
  var mailinglist = req.mailinglist;

  mailinglist.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mailinglist);
    }
  });
};

/**
 * List of Mailinglists
 */
exports.list = function (req, res) {
  Mailinglist.find({ group: req.mailinglistGroup._id }).sort('-created').exec(function (err, mailinglists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mailinglists);
    }
  });
};

/**
 * Mailinglist middleware
 */
exports.mailinglistByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mailinglist is invalid'
    });
  }

  Mailinglist.findById(id).exec(function (err, mailinglist) {
    if (err) {
      return next(err);
    } else if (!mailinglist) {
      return res.status(404).send({
        message: 'No mailinglist with that identifier has been found'
      });
    }
    req.mailinglist = mailinglist;
    next();
  });
};
