'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  mammoth = require('mammoth'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ArticleSender = mongoose.model('ArticleSender'),
  nodemailer = require('nodemailer'),
  _ = require('lodash');

var saveArticleSender = function (articleSender, res) {
  articleSender.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articleSender);
    }
  });
};

exports.sendEmail = function(options) {
// create reusable transporter object using the default SMTP transport
  var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'noruya@gmail.com',
      pass: 'shfndi#09'
    }
  };

  var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols
  var mailOptions = {
    from: '"비트피알" <news@bitpr.kr>', // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    text: options.text, // plaintext body
    html: options.html // html body
  };

// send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
};

/**
 * Create a Article sender
 */
exports.create = function (req, res) {
  console.log(req.files);
  var data = req.body;
  if (typeof req.files === 'object') {
    data = req.body;
    mammoth.convertToHtml({ path: req.files.file.path })
      .then(function (result) {
        data.content = result.value;
        console.log(result.messages);
        saveArticleSender(new ArticleSender(data), res);

      }, function (err) {
        console.log('err: ' + err);
        res.status(400).send({
          message: "'MS Word'가 아닙니다. 파일을 확인해주세요."
        });
      }).done();
  } else {
    var articleSender = new ArticleSender(data);
    articleSender.user = req.user;
    saveArticleSender(articleSender, res);
  }
};

exports.send = function(req, res) {
  console.log('send ---');
  console.log(req.body);
  var sendMailOptions = {
    to: 'noruya@gmail.com',
    subject: 'test mail',
    text: '',
    html: '<p>test html</p>'
  };
  exports.sendEmail(sendMailOptions);
  res.json({status: 'ok', message:'success'});
};

/**
 * Show the current Article sender
 */
exports.read = function (req, res) {
  console.log('read');

  ArticleSender.findById(req.articleSender._id).populate('user', 'displayName').exec(function (err, articleSender) {
    if (err) return next(err);
    if (!articleSender) return next(new Error('Failed to load articleSender ' + id));

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
