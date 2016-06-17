(function () {
  'use strict';
  var mongoose = require('mongoose'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    DailyCount = mongoose.model('DailyCount'),
    User = mongoose.model('User'),
    _ = require('lodash');

  exports.dailyCounts = function (req, res) {
    DailyCount.find({ user: req.user._id }).sort('date').exec(function (err, dailyCounts) {
      if (err) {
        console.error(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(dailyCounts);
    });
  };
}());

