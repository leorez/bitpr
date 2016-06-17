(function () {
  'use strict';
  require('./../modules/users/server/models/user.server.model.js');
  require('./../modules/users/server/models/crawled-article.server.model.js');
  require('./../modules/monitoring/server/models/daily-count.server.mode.js');
  require('date-format-lite');

  var mongoose = require('mongoose'),
    _ = require('lodash'),
    chalk = require('chalk'),
    dateAdder = require('add-subtract-date'),
    User = mongoose.model('User'),
    DailyCount = mongoose.model('DailyCount'),
    CrawledArticle = mongoose.model('CrawledArticle');

  var _db;

  function createDate(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  function countDaily(err, user) {
    var days = 100;
    var doneCnt = 0;
    var lastDate = '2016-07-30 00:00:00.000';

    function doneProc() {
      if (days === ++doneCnt)
        closeDB();
    }

    for (var i=0; i < days; ++i) {
      var d1 = dateAdder.add(createDate(new Date(lastDate)), i, 'days');
      var d2 = dateAdder.add(createDate(new Date(lastDate)), i + 1, 'days');
      console.log('d1 : ' + d1);
      console.log('d2 : ' + d2);

      CrawledArticle.aggregate([
        {
          $match: {
            articleAt: {
              $gte: d1,
              $lt: d2
            }
          }
        },
        {
          $group: {
            _id: "$keyword",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            keyword: "$_id",
            count: 1,
            date: { $literal: d1.format('YYYY-MM-DD') }
          }
        }
      ], function (err, res) {
        if (err) {
          console.error(err);
        }
        console.log(res);
        insertData(res, user, doneProc);
      });
    }
  }

  function insertData(datas, user, next) {
    datas.forEach(function (data) {
      var dailyCount = new DailyCount(data);
      dailyCount.user = user;
      dailyCount.save(next);
    });
  }

  function closeDB() {
    _db.connection.db.close(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.info('closed db');
      }
    });
  }

  exports.run = function (db) {
    console.log('ArticleCounter::run');
    _db = db;

    User.findOne({ email: 'test@test.com' }, countDaily);
  };


  /*
   db.crawledarticles.aggregate([ {$match: {articleAt: {$gte: new Date(2016, 6, 13), $lt: new Date(2016,6,14)}}},  {$group: {_id: "$keyword", total: { $sum: 1}}} ])
   */

}());

