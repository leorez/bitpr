(function () {
  'use strict';
  require('./../modules/users/server/models/user.server.model.js');
  require('./../modules/users/server/models/crawled-article.server.model.js');

  var should = require('should'),
    config = require('./../config/config'),
    mongoose = require('mongoose'),
    chalk = require('chalk'),
    async = require('async'),
    User = mongoose.model('User'),
    CrawledArticle = mongoose.model('CrawledArticle'),
    dateAdder = require('add-subtract-date'),
    _ = require('lodash'),
    articleCounter = require('../lib/article.counter');

  var dburl = 'mongodb://localhost/bitpr-test';
  var db;

  function closeDB() {
    db.connection.db.close(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.info('closed db');
      }
    });
  }

  var user1 = {
    corpCode: '053110',
    corpName: '소리바다',
    firstName: 'test',
    lastName: 'user',
    email: 'yhyoo74@naver.com',
    username: 'testUser',
    displayName: '홍길동',
    password: 'P@$$w0rd!!',
    provider: 'local',
    telephone: '02-0987-6543',
    cellphone: '010-2187-3886',
    crawlTimeHour: 10,
    crawlTimeMinutes: 0,
    keywords: 'keyword1, keyword2, keyword3'
  };

  var article1 = {
    title: 'Title',
    summary: 'Summary',
    media: 'media',
    url: 'url'
  };

  function createTestData(callback) {
    console.log(chalk.yellow('createTestData'));

    var date = new Date();

    async.waterfall([
      function(next) {
        console.log('function1');
        db.connection.db.dropDatabase(next);
      },
      function (aResult, next) {
        console.log('function2');
        var user = new User(user1);
        user.save(function (err) {
          next(err, user);
        });
      },
      function (user, next) {
        console.log('function3');
        console.log(user);

        var days = 365;
        var keywords = user.keywords.split(',');

        var doneCnt = 0;
        var list = [];
        var terms = [];
        terms.push(Math.floor((Math.random() * 100) + 1));
        terms.push(Math.floor((Math.random() * 300) + 1));

        function doneProc() {
          if (++doneCnt === list.length) {
            //closeDB();
            callback();
          }
        }

        for (var i=0; i < days; ++i) {
          date = _.clone(dateAdder.add(date, 1, "day"));
          console.log(date);

          keywords.forEach(function (keyword, index) {
            console.log(keyword);
            var perDay = Math.floor((Math.random() * 30) + 1);
            console.log('perDay: ' + perDay);

            if (index === 0  || (index > 0 && i > terms[index-1])) {
              for (var j=0; j < perDay; ++j) {
                article1.title = article1.title;
                article1.user = user;
                article1.articleAt = date;
                article1.keyword = keyword;
                var article = new CrawledArticle(article1);
                list.push(article);
              }
            }

          });
        }

        list.forEach(function (article) {
          article.save(function (err) {
            if (err) {
              console.error(err);
            }
            doneProc();
          });
        });

      }
    ], function (err) {
      if (err) {
        console.error(err);
      }
    });

  }
  db = mongoose.connect(dburl, function (err) {
    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.error(chalk.red(err));
    }
    console.info(chalk.green('db connected'));
  });

  function onDataReady() {
    console.log('onDataReady');
    articleCounter.run(db);
    
  }

  db.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dburl);
    createTestData(onDataReady);
  });

}());

