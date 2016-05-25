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
  mail = require('./lib/mail'),
  process = require('process'),
  sms = require('./lib/cafe24.sms.js'),
  dart = require('./lib/dart'),
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

function phonesString(article) {
  if((typeof article.user.telephone === 'undefined' || article.user.telephone === '') &&
    (typeof article.user.cellphone === 'undefined' || article.user.cellphone === ''))
    return '';

  var phones = '(';
  if (typeof article.user.telephone !== 'undefined' && article.user.telephone !== '')
    phones += article.user.telephone + '/ ';
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
    content += '<h1 style="text-align: center">보도자료</h1>';
    content += '<hr/>';
    content += '<h3 style="text-align: center">(주) ' + corpName + '</h3>';
    content += '<hr/>';
    content += 'Date <span style="margin-left: 10px">' + (new Date()).format('YYYY.M.D') + '</span>';
    content += '<p>Company <span style="margin-left: 10px">' + corpName + ' ' + article.user.displayName + ' ' + phones + '</span></p>'
    content += '<hr/>';
    content += '<h1>' + article.title + '</h1>';
    content += article.content;
    content += '</pre>';
    callback(content);
  });
}

var dstRoot = __dirname+'/uploads';

function sendArticle(article) {
  console.log('sending... ');

  var onContentReady = function (content) {
    console.log(content);
    var sendMailOptions = {
      from: '"비트피알" <news@bitpr.kr>',
      to: article.emails || 'noruya@gmail.com',
      subject: article.title,
      html: content,
      attachments: []
    };

    mail.attachFile(sendMailOptions, article.file, dstRoot + '/docs/');
    mail.attachFile(sendMailOptions, article.image1, dstRoot + '/images/');
    mail.attachFile(sendMailOptions, article.image2, dstRoot + '/images/');
    mail.attachFile(sendMailOptions, article.image3, dstRoot + '/images/');

    mail.sendEmail(sendMailOptions, function (err, info) {
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
            msg: "[비트피알] 보도자료가 발송완료되었습니다.",
            mobile: [cellphone]
          };

          sms.send(smsOptions).then(function (result) {
            console.log(result);
            console.log(chalk.green('sms가 발송되었습니다. : ' + smsOptions.msg));
          }).catch(function (err) {
            console.error(chalk.red(err));
          }).done();
        }
      }
    });
  };

  contentBuild(article, onContentReady);
}

function sendAlertSms(article) {
  var cellphone = article.user.cellphone.replace(/[^0-9]+/g, '');

  var cancelShortUrl = 'http://goo.gl/9SLq8K';
  // send sms
  var smsOptions = {
    msg: '[비트피알] 보도자료가 5분후 발송됩니다. 발송취소 : ' +  cancelShortUrl,
    mobile: [cellphone]
  };

  sms.send(smsOptions).then(function (result) {
    console.log(result);
    article.smsAlerted = true;
    article.smsAlertedTime = new Date();
    article.save(function (err) {
      if (err) {
        console.error(chalk.red('Error: ' + err));
      } else {
        console.log(chalk.green('sms가 발송되었습니다. : ' + smsOptions.msg));
      }
    });
  }).catch(function (err) {
    console.error(chalk.red(err));
  }).done();
}

// 20160516 형식의 날짜 문자열을 Date형으로 변환
function strDateToDate(strDate, strTime) {
  if (/[0-9]{8}/.test(strDate) === false) return null;
  var dt = strDate.substring(0,4) + '-' + strDate.substring(4,6) + '-' + strDate.substring(6,8);
  if (strTime) dt += ' ' + strTime;
  return new Date(dt);
}

/**
 * 공시이후 발송
 */
function sendAfterDarted(article) {
  console.log('공시이후 발송');
  var options = {
    crp_cd: article.user.corpCode,
    start_dt: article.reserved.format('YYYYMMDD'),
    fin_rpt: 'Y',
    dsp_tp: article.dspType
  };

  console.log('send parameters : ' + JSON.stringify(options));

  dart.searchMockTest(options, function (error, data) {
    if (!error) {
      console.log(chalk.green(JSON.stringify(data)));
      data.list.forEach(function (item) {
        var rcp_dt = strDateToDate(item.rcp_dt, article.reserved.format('hh:mm:ss'));
        console.log(chalk.blue(rcp_dt));
        var diff = new DateDiff(article.reserved, rcp_dt);
        console.log(chalk.red(diff.days()));

        if (diff.days() >= 0) {
          console.log(chalk.blue('공시확인됨 발송 : ' + article));
          if (!article.smsAlerted) {
            console.log(chalk.blue('예약 5분전 SMS 통보'));
            sendAlertSms(article);
          } else {

            var diff = new DateDiff(new Date(), article.smsAlertedTime);
            console.log(chalk.green(diff.minutes()));
            if (diff.minutes() >= 5.0) {
              console.log(chalk.blue('발송'));
              sendArticle(article);
            }
          }
        }
      });
    }
  });
}

/**
 * 예약발송
 */
function sendReserved(article) {
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
  if (diff.minutes() < 0.1) {
    sendArticle(article);
  }
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
            // 즉시발송
            console.log('즉시발송');
            sendArticle(article);
          } else if (article.reserveTime === 999) {
            // 공시이후 발송
            sendAfterDarted(article);

          } else {
            // 예약발송
            sendReserved(article);
          }
        } else if(article.status === 'ReSend') {
          // 재전송
          console.log(chalk.blue('재전송'));
          sendArticle(article);
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

var job = schedule.scheduleJob('*/20 * * * * *', function () {
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
