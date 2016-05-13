/**
 * Created by noruya on 16. 4. 26.
 */
'use strict';

require('./modules/users/server/models/crawled-article.server.model');
require('./modules/users/server/models/user.server.model');
require('./modules/article-senders/server/models/article-sender.server.model');
var searchController = require('./modules/core/server/controllers/search.server.controller.js');

var config = require('./config/config'),
  mongoose = require('mongoose'),
  chalk = require('chalk'),
  User = mongoose.model('User'),
  CrawledArticle = mongoose.model('CrawledArticle'),
  ArticleSender = mongoose.model('ArticleSender'),
  schedule = require('node-schedule'),
  nodemailer = require('nodemailer'),
  Deferred = require('deferred-js'),
  dateAdder = require('add-subtract-date'),
  DateDiff = require('date-diff'),
  moment = require('moment'),
  mailcomposer = require('mailcomposer'),
  process = require('process'),
  sms = require('./bluehouselabsms'),
  request = require('request');
require('date-format-lite');

switch (process.env.NODE_ENV) {
  case 'test':
    config.db.url = 'mongodb://localhost/bitpr-test';
    break;
  case 'development':
    config.db.url = 'mongodb://localhost/bitpr-dev';
    break;
  case 'production':
    config.db.url = 'mongodb://localhost/bitpr';
    break;
  default:
    config.db.url = 'mongodb://localhost/bitpr';
    break;
}

console.log(config.db.url);

var db = mongoose.connect(config.db.url, function (err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }
});

var search = function (usersCnt, user, since) {
  var jobs = 0;
  var keywords = user.keywords.split(',');
  var complete = 0;

  keywords.forEach(function (keyword) {
    keyword = keyword.trim();
    console.log(keyword);

    Deferred.when(searchController.searchFromMedog(keyword, since)).then(function (result) {
      var datas = JSON.parse(result).data;
      //console.log(datas);
      var rows = 0;
      datas.forEach(function (item) {
        //console.log(item);
        var article = new CrawledArticle({
          keyword: keyword,
          title: item.title,
          summary: item.summary,
          media: item.media,
          url: item.url,
          articleAt: item.article_at,
          user: user
        });

        article.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            rows++;
          }
        });
      });

      if (++complete === keywords.length) {
        if (usersCnt == ++jobs) {
          console.log('finish');
        }
      }
    }, function (err) {
      console.log(err);
    });
  });
};

var api_key = 'key-52k6ubqaqzw6ir5g75mob96cqa03-xi3';
var domain = 'bitpr.kr';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

function sendEmail(options, callback) {
  console.log('sendEmail');
  var mail = mailcomposer({
    from: '"비트피알" <news@bitpr.kr>', // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    html: options.html, // plaintext body
    attachments: options.attachments
  });

  mail.build(function (mailBuildError, message) {
    if (mailBuildError) {
      console.error(mailBuildError);
      callback(mailBuildError, message);
      return;
    }

    var dataToSend = {
      to: options.to,
      message: message.toString('ascii')
    };

    console.log(message);

    mailgun.messages().sendMime(dataToSend, function (error, body) {
      console.log(body);
      console.log(error);
      callback(error, body);
    });
  });
}

var dstRoot = __dirname+'/uploads';

function attachFile(sendMailOptions, file, root) {
  if (typeof file !== 'undefined' && file.length > 0) {
    sendMailOptions.attachments.push({ filename: file, path: root + file });
  }
}

function sendArticle(article) {
  console.log('sending... '+article);
  var sendMailOptions = {
    to: 'noruya@gmail.com, zidell@gmail.com, smartkoh@gmail.com ',
    subject: article.title,
    html: '<pre><h2>' + article.title + '</h2>' + article.content + '</pre>',
    attachments: []
  };

  attachFile(sendMailOptions, article.file, dstRoot + '/docs/');
  attachFile(sendMailOptions, article.image1, dstRoot + '/docs/');
  attachFile(sendMailOptions, article.image2, dstRoot + '/docs/');
  attachFile(sendMailOptions, article.image3, dstRoot + '/docs/');

  sendEmail(sendMailOptions, function (err, info) {
    if(!err) {
      article.status = 'Sent';
      article.sent = new Date();
      article.save(function (err) {
        if (err) {
          console.error('Error: ' + err);
        } else {
          console.log('Sent news : ' + article);
        }
      });

      // send sms
      var smsOptions = {
        "CONTENT" : "[비트피알] 작성하신 보도자료가 발송되었습니다. (" + article.title + ")",
        "SENDER" : "01021873886",
        "RECEIVERS" : ["01021873886"]
      };

      sms.send(smsOptions, function (err) {
        if (err)
          console.error(err);
      });
    }
  });
}

/*****************************
 ** 보도자료발송
 *****************************/
function sendArticleEmails() {
  ArticleSender.find().sort('-reserved').exec(function (err, articleSenders) {
    if (err) {
      console.log(err);
    } else {
      articleSenders.forEach(function(article) {
        if(article.status === 'Reserved') {

          if (article.reserveTime === 0) {
            console.log('즉시발송');
            sendArticle(article);
          } else if (article.reserveTime === 999) {
            console.log('공시이후 발송');
          } else {
            Date.masks.default = 'YYYY-MM-DD hh:mm:ss';
            var t = dateAdder.add(article.reserved, article.reserveTime, "hour");
            var diff = new DateDiff(t, new Date());
            console.log(t.format());
            console.log('diff hours: ' + diff.hours());
            console.log('diff minutes: ' + diff.minutes());
            console.log('diff seconds: ' + diff.seconds());
            console.log(typeof diff.hours());

            if (article.reserveTime > 0 && diff.minutes() <= 5.0) {
              console.log('예약 5분전 SMS 통보');
            }

            if(diff.minutes() < 1.0) {
              sendArticle(article);
            }
          }
        }
      });
    }
  });
}

/*****************************
 ** 기사수집
 *****************************/
function crawlArticlesEachUser() {
  var time = new Date();

  var where = {
    enabledCrawler: true,
    crawlTimeHour: time.getHours(),
    crawlTimeMinutes: time.getMinutes()
  };

  User.find(where).exec(function (err, users) {
    if (err) {
      console.log(err);
    } else {

      users.forEach(function (user) {
        var since = '';
        CrawledArticle.findOne({_id: user._id}).sort('-created').exec(function (err, article) {
          if (err) {
            search(users.length, user, '');
          } else {
            if (article === null) {
              console.log('use since blank');
              search(users.length, user, '');
            } else {
              console.log(article);
              Date.masks.default = 'YYYY-MM-DD hh:mm:ss';
              since = article.created.format();
              console.log(since);
              search(users.length, user, since);
            }
          }
        });
      });
    }
  });
}

var job = schedule.scheduleJob('*/5 * * * * *', function () {
  console.log('start');
  /***************************
   * 보도자료 발송
   **************************/
  sendArticleEmails();

  /******************************
   *  기사수집
   ******************************/
  crawlArticlesEachUser();
});
