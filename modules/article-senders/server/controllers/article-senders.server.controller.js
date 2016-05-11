'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  mammoth = require('mammoth'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ArticleSender = mongoose.model('ArticleSender'),
  nodemailer = require('nodemailer'),
  fs = require('fs-extra'),
  appRoot = require('app-root-path'),
  _ = require('lodash');

var saveArticleSender = function (articleSender, req, res) {
  articleSender.user = req.user;
  articleSender.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      articleSender.user = req.user;
      res.json(articleSender);
    }
  });
};

function saveImage(image) {
  if (image) {
    var uploadRoot = appRoot + '/uploads';
    var filename = path.basename(image.path);
    var savePath = uploadRoot + '/images/' + filename;
    fs.move(image.path, savePath, function (err) {
      if (err) console.error(err);
      console.log('mv success' + savePath);
    });

    console.log(savePath);
    return filename;
  }

  return undefined;
}

/**
 * Create a Article sender
 */
exports.create = function (req, res) {
  console.log(req.files);
  var articleSender = new ArticleSender(req.body);

  if (typeof req.files === 'object') {
    var files = req.files;
    var url;
    url = saveImage(files.image1);
    if (url !== undefined) {
      articleSender.image1 = url;
    }

    url = saveImage(files.image2);
    if (url !== undefined) {
      articleSender.image2 = url;
    }

    url = saveImage(files.image3);
    if (url !== undefined) {
      articleSender.image3 = url;
    }

    if (files.file) {
      mammoth.convertToHtml({ path: files.file.path })
        .then(function (result) {
          articleSender.content = result.value;
          saveArticleSender(articleSender, req, res);

        }, function (err) {
          console.log('err: ' + err);
          res.status(400).send({
            message: '\'MS Word\'가 아닙니다. 파일을 확인해주세요.'
          });
        }).done();
    } else {
      saveArticleSender(articleSender, req, res);
    }
  } else {
    saveArticleSender(articleSender, req, res);
  }
};

exports.send = function (req, res) {
  console.log('send ---');
  console.log(req.body);
  var sendMailOptions = {
    to: 'noruya@gmail.com',
    subject: 'test mail',
    text: '',
    html: '<p>test html</p>'
  };
  res.json({ status: 'ok', message: 'success' });
};

/**
 * Show the current Article sender
 */
exports.read = function (req, res) {
  console.log('read');

  ArticleSender.findById(req.articleSender._id).populate('user', 'displayName').exec(function (err, articleSender) {
    // if (err) return next(err);
    // if (!articleSender) return next(new Error('Failed to load articleSender ' + id));

    console.log(articleSender);
    req.articleSender = articleSender;

    // update reserved
    articleSender.reserved = new Date();
    articleSender.status = 'Reserved';
    articleSender.save(function (err) {
      if (err) {
        return res.status(400).send({
          messeage: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(req.articleSender);
      }
    });
  });
};

/**
 * Update a Article sender
 */
exports.update = function (req, res) {
  var articleSender = req.articleSender;

  articleSender = _.extend(articleSender, req.body);
  articleSender.save(function (err) {
    if (err) {
      return res.status(400).send({
        messeage: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articleSender);
    }
  });
};

/**
 * Delete an Article sender
 */
exports.delete = function (req, res) {
  var articleSender = req.articleSender;

  articleSender.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articleSender);
    }
  });
};

/**
 * List of Article senders
 */
exports.list = function (req, res) {
  ArticleSender.find().sort('-created').populate('user', 'displayName').exec(function (err, articleSenders) {
    if (err) {
      return res.status(400).send({
        messeage: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articleSenders);
    }
  });
};


exports.articleSenderByID = function (req, res, next, id) {
  ArticleSender.findById(id).populate('user', 'displayName').exec(function (err, articleSender) {
    if (err) return next(err);
    if (!articleSender) return next(new Error('Failed to load articleSender ' + id));

    req.articleSender = articleSender;
    next();
  });
};

exports.hasAuthorization = function (req, res, next) {
  if (req.articleSender.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
