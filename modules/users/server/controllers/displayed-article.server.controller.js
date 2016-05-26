/**
 * Created by noruya on 16. 4. 24.
 */
'use strict';

var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  DisplayedArticle = mongoose.model('DisplayedArticle'),
  User = mongoose.model('User'),
  _ = require('lodash');

exports.create = function (req, res) {
  var article = new DisplayedArticle(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      console.log('err: ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }

  });
};

exports.list = function (req, res) {
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
      options = { user: user._id };
      query = DisplayedArticle.find(options).sort('-created');
      query.exec(function (err, articles) {
        onFinish(err, articles);
      });
    });
  } else {
    options = { user: req.user._id };
    query = DisplayedArticle.find(options).sort('-created').populate('user', 'email');
    query.exec(function (err, articles) {
      onFinish(err, articles);
    });
  }
};

exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.displayedArticleByID = function (req, res, next, id) {
  DisplayedArticle.findById(id).populate('user', 'email').exec(function (err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('Failed to load article' + id));
    req.article = article;
    next();
  });
};

exports.hasAuthorization = function (req, res, next) {
  if (req.article.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not atuthorized'
    });
  }
  next();
};

