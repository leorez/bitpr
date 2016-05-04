/**
 * Created by noruya on 16. 4. 26.
 */
'use strict';

var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  CrawledArticle = mongoose.model('CrawledArticle'),
  _ = require('lodash');

exports.list = function (req, res) {
  console.log('run list')
  CrawledArticle.find().sort('-created').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log(articles);
      res.json(articles);
    }
  });
};
