/**
 * Created by noruya on 16. 4. 26.
 */
'use strict';

require('./modules/users/server/models/crawled-article.server.model');
require('./modules/users/server/models/user.server.model');
require('./modules/article-senders/server/models/article-sender.server.model');
var searchController = require('./modules/core/server/controllers/search.server.controller.js'),
  coreController = require('./modules/core/server/controllers/core.server.controller');

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
      console.error(err);
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

function phonesString(article) {
  if((typeof article.user.telephone === 'undefined' || article.user.telephone === '') &&
    (typeof article.user.cellphone === 'undefined' || article.user.cellphone === ''))
    return '';

  var phones = '(연락처 : ';
  if (typeof article.user.telephone !== 'undefined' && article.user.telephone !== '')
    phones += article.user.telephone + ', ';
  if (typeof article.user.cellphone !== 'undefined' && article.user.cellphone !== '')
    phones += article.user.cellphone;
  phones += ')';

  return phones;
}

function contentBuild(article, callback) {
  coreController.corpCodeToName(article.user.corpCode, function (corpName, error) {
    if (error) {
      console.error(error);
      corpName = article.user.corpName;
    } else {
      // save corpName
      var user = new User(article.user);
      user.corpName = corpName;
      user.save(function (err) {
        if (err) console.error(err);
      });
    }

    var phones = phonesString(article);
    var content = '<pre>';
    content += '<h1>' + article.title + '</h1>';
    content += '<p>' + corpName + ' ' + article.user.displayName + ' ' + phones + '</p>'
    content += '<h2>보도자료</h2>';
    content += article.content;
    content += '</pre>';
    callback(content);
  });
}

function sendArticle(article) {
  console.log('sending... ');

  var onContentReady = function (content) {
    var sendMailOptions = {
      to: 'noruya@gmail.com',
      subject: article.title,
      html: content,
      attachments: []
    };

    attachFile(sendMailOptions, article.file, dstRoot + '/docs/');
    attachFile(sendMailOptions, article.image1, dstRoot + '/images/');
    attachFile(sendMailOptions, article.image2, dstRoot + '/images/');
    attachFile(sendMailOptions, article.image3, dstRoot + '/images/');

    sendEmail(sendMailOptions, function (err, info) {
      if(!err) {
        article.status = 'Sent';
        article.sent = new Date();
        article.save(function (err) {
          if (err) {
            console.error('Error: ' + err);
          } else {
            console.log(chalk.blue('발송완료: ' + article.title));
          }
        });

        if (typeof  article.user.cellphone !== 'undefined' && article.user.cellphone.length > 0) {
          var cellphone = article.user.cellphone.replace(/[^0-9]+/g, '');

          // send sms
          var smsOptions = {
            "CONTENT": "[비트피알] 작성하신 보도자료가 발송되었습니다. (" + article.title + ")",
            "SENDER": "01021873886",
            "RECEIVERS": [cellphone]
          };

          sms.send(smsOptions, function (err) {
            if (err)
              console.error(err);
          });
        }
      }
    });
  };

  contentBuild(article, onContentReady);
}

function sendAlertSms(article) {
  var cellphone = article.user.cellphone.replace(/[^0-9]+/g, '');

  // send sms
  var smsOptions = {
    "CONTENT": "[비트피알] 작성하신 보도자료(" + article.title + ")가 5분후에 발송됩니다. 취소하시려면 [발송취소]를 눌러주세요 <a href='http://test.bitpr.kr:9292/cancel-article-sender/" + article._id + "'>[발송취소]</a>",
    "SENDER": "025981234",
    "RECEIVERS": [cellphone]
  };
  // smsOptions.CONTENT = "<a href='" + article._id + "'>[발송취소]</a>";

  sms.send(smsOptions, function (err) {
    if (err) {
      console.error(chalk.red(err));
    } else {
      article.smsAlerted = true;
      article.save(function (err) {
        if (err) {
          console.error(chalk.red('Error: ' + err));
        }
      });
    }
  });
}

/*****************************
 ** 보도자료발송
 *****************************/
function sendArticleEmails() {
  ArticleSender.find().sort('-reserved').populate('user').exec(function (err, articleSenders) {
    if (err) {
      console.error(err);
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

            // 예약 5분전 SMS 통보
            if (!article.smsAlerted && diff.minutes() <= 5.0 && diff.minutes() > 4.0) {
              console.log('예약 5분전 SMS 통보');
              sendAlertSms(article);
            }

            // 예약시간이 되면 발송
            if(diff.minutes() < 0.1) {
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

var job = schedule.scheduleJob('*/30 * * * * *', function () {
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
