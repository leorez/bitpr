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
    articleCounter = require('../lib/article.counter');

  describe('ArticleCounter Tests', function () {
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


    function createTestData() {
      console.log(chalk.yellow('createTestData'));

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
          next();
        }
      ], function (err) {
        if (err) {
          console.error(err);
        }
      });


      // var total = 365;
      // var keywords = user.keywords.split(',');
      // var date = new Date();
      //
      // for (var i=0; i < total; ++i) {
      //   article1.user = user;
      //   article1.articleAt = date;
      //   var article = new CrawledArticle(article1);
      //   article.save();
      // }
    }

    before(function () {
      db = mongoose.connect(dburl, function (err) {
        if (err) {
          console.error(chalk.red('Could not connect to MongoDB!'));
          console.error(chalk.red(err));
        }
        console.info(chalk.green('db connected'));
      });

      db.connection.on('connected', function () {
        console.log('Mongoose default connection open to ' + dburl);
      });
      createTestData();
    });

    describe('Test Main', function () {

      it('canary test', function () {
        should(true).be.ok();
      });

      it('일별 카운트 테스트', function () {

        should(true).be.ok();
      });
    });

    after(function () {
      closeDB();
    });
  });
}());

