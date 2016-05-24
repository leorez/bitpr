/**
 * Created by noruya on 16. 4. 24.
 */
'use strict';

var mongoose = require('mongoose'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  DisplayedArticle = mongoose.model('DisplayedArticle'),
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
  DisplayedArticle.find({ user: req.user._id }).sort('-created').populate('user', 'email').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
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

