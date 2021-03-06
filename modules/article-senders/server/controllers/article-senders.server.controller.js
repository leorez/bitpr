'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  mammoth = require('mammoth'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  ArticleSender = mongoose.model('ArticleSender'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  fs = require('fs-extra'),
  appRoot = require('app-root-path'),
  mail = require(path.resolve('./lib/mail')),
  Q = require('q'),
  _ = require('lodash');

function buildContent(articleSender) {
  var content = '';
  content += '<h2>' + articleSender.subheadline + '</h2>';
  content += articleSender.lead + '<br/><br/>';
  content += articleSender.main + '<br/><br/>';
  content += articleSender.detail + '<br/><br/>';
  content += articleSender.corpSummary + '<br/><br/>';

  return content;
}

var saveArticleSender = function (articleSender, req, res) {
  articleSender.user = req.user;
  articleSender.content = buildContent(articleSender);
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

var _uploadRoot = appRoot + '/uploads';

function saveFile(file, subpath) {
  if (file) {
    var filename = path.basename(file.path);
    var savePath = _uploadRoot + subpath + filename;
    fs.move(file.path, savePath, function (err) {
      if (err) console.error(err);
      console.log('mv success' + savePath);
    });

    console.log(savePath);
    return filename;
  }

  return undefined;
}

function saveImage(image) {
  return saveFile(image, '/images/');
}

function saveDoc(file) {
  return saveFile(file, '/docs/');
}

/**
 * Create a Article sender
 */
exports.create = function (req, res) {
  console.log(req.files);
  var articleSender = new ArticleSender(req.body);
  var files = req.files;

  if (files && files.imageFiles && files.imageFiles.length > 0) {
    var url;
    files.imageFiles.forEach(function (file) {
      url = saveImage(file);
      if (url !== undefined) {
        if (!articleSender.image1) {
          articleSender.image1 = url;
          articleSender.image1Orgin = file.originalFilename;
        } else if (!articleSender.image2) {
          articleSender.image2 = url;
          articleSender.image2Orgin = file.originalFilename;
        } else if (!articleSender.image3) {
          articleSender.image3 = url;
          articleSender.image3Orgin = file.originalFilename;
        }
      }
    });
  }

  if (files && files.file) {
    var filepath = saveDoc(files.file);
    if (filepath) {
      articleSender.file = filepath;
      articleSender.fileOrigin = files.file.originalFilename;
    }

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
};

exports.sendArticle = function (req, res) {
  console.log('send ---');
  console.log(req.body);

  ArticleSender.findById(req.body.articleSenderId).populate('user', 'displayName').exec(function (err, articleSender) {
    // if (err) return next(err);
    // if (!articleSender) return next(new Error('Failed to load articleSender ' + id));
    console.log(articleSender);
    articleSender.reserved = new Date();
    articleSender.status = 'Reserved';

    articleSender.save(function (err) {
      if (err) {
        return res.status(400).send({
          messeage: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json({ status: 'ok', message: 'success' });
      }
    });
  });
};

var dstRoot = __dirname + '/../../../../uploads';

// My 보도자료 파일공유
exports.sendFiles = function (req, res) {
  console.log('sendFiles : ' + JSON.stringify(req.body));
  if (req.body.emails !== undefined && req.body.emails.length > 0
    && req.body.files !== undefined && req.body.files.length > 0) {
    var emails = req.body.emails;
    var files = req.body.files;

    var sendMailOptions = {
      from: req.body.from,
      to: emails.join(','),
      subject: '파일을 공유합니다.',
      html: '파일공유',
      attachments: []
    };

    files.forEach(function (file) {
      mail.attachFile(sendMailOptions, file, dstRoot);
    });

    mail.sendEmail(sendMailOptions, function (err, info) {
      if (!err) {
        res.json({ status: 'ok', message: '메일이 전송되었습니다.' });
      } else {
        return res.status(400).send({
          message: '메일전송에 실패하였습니다.'
        });
      }
    });

  } else {
    return res.status(400).send({
      message: '발송이메일 주소나 파일이 없습니다.'
    });
  }
};

// My 보도자료 재전송
exports.reSendArticle = function (req, res) {
  var reporters = req.body.reporters;
  var emails = '';
  reporters.forEach(function (item, index) {
    emails += item.corpName + item.name + ' <' + item.email + '>';
    if (index !== reporters.length - 1) {
      emails += ',';
    }
  });

  var articleSenders = req.body.articleSenders;
  console.log(articleSenders);
  articleSenders.forEach(function (id) {
    ArticleSender.findById(id).populate('user', 'displayName').exec(function (err, articleSender) {
      if (!err) {
        if (articleSender._id !== undefined && articleSender.status === 'Sent') {
          console.log(articleSender._id);
          articleSender.status = 'ReSend';
          articleSender.emails = emails;
          articleSender.save(function (err) {
            if (err) {
              return res.status(400).send({
                messeage: errorHandler.getErrorMessage(err)
              });
            }
          });
        }
      } else {
        return res.status(400).send({
          messeage: errorHandler.getErrorMessage(err)
        });
      }
    });
  });

  res.json({ status: 'ok', message: '메일이 전송되었습니다.' });
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
    res.json(articleSender);
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

exports.listForEmbed = function (req, res) {
  User.findOne({ corpCode: req.params.corpCode }).exec(function (err, user) {
    ArticleSender.find({ user: user._id }, { title: 1, content: 1, created: 1 }).sort('-created').exec(function (err, articleSenders) {
      if (err) {
        return res.status(400).send({
          messeage: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(articleSenders);
      }
    });
  });
};

var count = function (opt, req, callback) {
  var options = _.clone(opt);
  var counts = {};

  ArticleSender.count(options, function (err, count) {
    if (err) return callback(err);
    counts.totalItems = count;

    delete options.status;
    ArticleSender.count(options, function (err, count) {
      if (err) return callback(err);
      counts.totalCount = count;

      options.status = 'Reserved';
      ArticleSender.count(options, function (err, count) {
        if (err) return callback(err);
        counts.reservedCount = count;

        options.status = 'Sent';
        ArticleSender.count(options, function (err, count) {
          if (err) return callback(err);
          counts.sentCount = count;

          options.status = 'Temporary';
          ArticleSender.count(options, function (err, count) {
            if (err) return callback(err);
            counts.temporaryCount = count;

            options.status = { $in: ['Canceled', 'Error'] };
            ArticleSender.count(options, function (err, count) {
              if (err) return callback(err);
              counts.elseCount = count;
              callback(err, counts);
            });
          });
        });
      });
    });
  });
};

/**
 * List of Article senders
 */
exports.list = function (req, res) {
  var limit = Number(req.params.limit);
  var skip = (Number(req.params.page) - 1) * limit;

  var options = { user: req.user._id };
  if (req.params.filter !== 'All') {
    options.status = req.params.filter;

    if (req.params.filter === 'Else') {
      options.status = { $in: ['Canceled', 'Error'] };
    }
  }

  var sort = '-created';
  switch (req.params.order) {
    case '최신순':
      sort = '-created';
      break;
    case '최신발송':
      sort = '-sent';
      break;
    case '오래된순':
      sort = 'created';
      break;
    case '희망보도 갯수':
      sort = '-sendCount';
      break;
    default:
      sort = '-created';
  }

  if (req.params.keyword) {
    options.$text = { $search: req.params.keyword };
  }

  count(options, req, function (err, counts) {
    if (err) {
      return res.status(400).send({
        messeage: errorHandler.getErrorMessage(err)
      });
    }

    ArticleSender.find(options).sort(sort).populate('user', 'email').limit(limit).skip(skip).exec(function (err, articleSenders) {
      if (err) {
        return res.status(400).send({
          messeage: errorHandler.getErrorMessage(err)
        });
      } else {
        var data = { counts: counts, articleSenders: articleSenders };
        res.json(data);
      }
    });
  });
};

exports.articleSenderByID = function (req, res, next, id) {
  ArticleSender.findById(id).populate('user', 'email').exec(function (err, articleSender) {
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
