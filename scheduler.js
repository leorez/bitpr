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
  request = require('request');
require('date-format-lite');

config.db.url = 'mongodb://localhost/bitpr';
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
  var data = {
    from: '"비트피알" <news@bitpr.kr>', // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    text: options.html // plaintext body
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    console.log(error);
    callback(error, body);
  });
}

/*
 ** 보도자료발송
 */
function sendArticleEmails() {
  ArticleSender.find().sort('-reserved').exec(function (err, articleSenders) {
    if (err) {
      console.log(err);
    } else {
      articleSenders.forEach(function(article) {
        if(article.status === 'Reserved') {

          Date.masks.default = 'YYYY-MM-DD hh:mm:ss';
          var t = dateAdder.subtract(article.reserved, article.reserveTime, "hour");
          var diff = new DateDiff(new Date(), t);
          console.log(t.format());
          console.log('diff hours: ' + diff.hours());
          console.log(typeof diff.hours());

          if(diff.hours() < 0.1) {
            console.log('sending... '+article);
            var sendMailOptions = {
              to: 'noruya@gmail.com;zidell@gmail.com;smartkoh@gmail.com ',
              subject: article.title,
              text: '',
              html: '<p><h2>' + article.title + '</h2>' + article.content + '</p>'
            };

            sendEmail(sendMailOptions, function (err, info) {
              if(!err) {
                article.status = 'Sent';
                article.sent = new Date();
                article.save(function (err) {
                  if (err) {
                    console.log('Error: ' + err);
                  } else {
                    console.log('Sent news : ' + article);
                  }
                });
              }
            });
          }
        }
      });
    }
  });
}

function run() {
  var time = new Date();

  sendArticleEmails();

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

var rule = new schedule.RecurrenceRule();
rule.second = 0;

var job = schedule.scheduleJob(rule, function () {
  console.log('start');
  run();
});
