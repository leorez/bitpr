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

var count = function (opt, req, callback) {
  var options = _.clone(opt);
  var counts = {};
  CrawledArticle.count(options, function (err, count) {
    if (err) return callback(err);
    counts.totalItems = count;

    delete options.displayed;
    CrawledArticle.count(options, function (err, count) {
      if (err) return callback(err);
      counts.totalCount = count;

      options.displayed = true;
      CrawledArticle.count(options, function (err, count) {
        if (err) return callback(err);
        counts.displayedCount = count;
        counts.notDisplayedCount = counts.totalCount - count;
        callback(err, counts);
      });
    });
  });
};

exports.list = function (req, res) {
  var limit = Number(req.params.limit);
  var skip = (Number(req.params.page) - 1) * limit;
  var options = { user: req.user._id };
  if (req.params.filter !== 'All') {
    if (req.params.filter === 'Displayed') {
      options.displayed = true;
    } else {
      options.displayed = { $in: [false, null] };
    }
  }

  count(options, req, function (err, counts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    console.log('options : ' + JSON.stringify(options));
    CrawledArticle.find(options).sort('-articleAt').populate('user', 'email').limit(limit).skip(skip).exec(function (err, articles) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var data = { counts: counts, articles: articles };
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
      query = CrawledArticle.find(options).sort('-articleAt');
      query.exec(function (err, articles) {
        onFinish(err, articles);
      });
    });
  } else {
    options = { user: req.user._id, displayed: true };
    query = CrawledArticle.find(options).sort('-articleAt').populate('user', 'email');
    query.exec(function (err, articles) {
      onFinish(err, articles);
    });
  }
};

exports.create = function (req, res) {
  var crawledArticle = new CrawledArticle(req.body);
  crawledArticle.user = req.user;
  crawledArticle.save(function (err) {
    if (err) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(crawledArticle);
      }
    }
  });
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
