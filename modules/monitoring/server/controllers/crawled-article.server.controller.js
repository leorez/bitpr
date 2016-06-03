/**
 * Created by noruya on 16. 4. 26.
 */
'use strict';

var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  CrawledArticle = mongoose.model('CrawledArticle'),
  User = mongoose.model('User'),
  _ = require('lodash');

exports.list = function (req, res) {
  var skip = (req.params.page - 1) * req.params.limit;
  CrawledArticle.count({ user: req.user._id }, function (err, count) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    CrawledArticle.find({ user: req.user._id }).sort('-created').populate('user', 'email').limit(req.params.limit).skip(skip).exec(function (err, articles) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var data = { totalItems: count, articles: articles };
        res.json(data);
      }
    });
  });
};


exports.displays = function (req, res) {
  var onFinish = function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  };

  var options,
    query;

  var corpCode = req.params.corpCode;
  if (corpCode) {
    User.findOne({ corpCode: corpCode }).exec(function (err, user) {
      if (err) {
        return res.status(400).send({
          message: 'not found corpCode'
        });
      }
      options = { user: user._id, displayed: true };
      query = CrawledArticle.find(options).sort('-created');
      query.exec(function (err, articles) {
        onFinish(err, articles);
      });
    });
  } else {
    options = { user: req.user._id, displayed: true };
    query = CrawledArticle.find(options).sort('-created').populate('user', 'email');
    query.exec(function (err, articles) {
      onFinish(err, articles);
    });
  }
};


exports.update = function (req, res) {
  var crawledArticle = req.crawledArticle;
  crawledArticle = _.extend(crawledArticle, req.body);

  crawledArticle.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(crawledArticle);
    }
  });
};

exports.crawledArticleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'CrawledArticle is invalid'
    });
  }

  CrawledArticle.findById(id).populate('user', 'displayName').exec(function (err, crawledArticle) {
    if (err) {
      return next(err);
    } else if (!crawledArticle) {
      return res.status(404).send({
        message: 'No crawledArticle with that identifier has been found'
      });
    }
    req.crawledArticle = crawledArticle;
    next();
  });
};
