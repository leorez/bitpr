(function () {
  'use strict';
  require('./../modules/users/server/models/user.server.model.js');
  require('./../modules/users/server/models/crawled-article.server.model.js');
  require('./../modules/dashboard/server/models/count-daily.server.model.js');
  require('date-format-lite');

  var mongoose = require('mongoose'),
    _ = require('lodash'),
    chalk = require('chalk'),
    dateAdder = require('add-subtract-date'),
    User = mongoose.model('User'),
    CountDaily = mongoose.model('CountDaily'),
    CrawledArticle = mongoose.model('CrawledArticle');

  var _db;

  function countDaily() {
    var days = 10;
    var date = new Date();
    var doneCnt = 0;

    function doneProc() {
      if (days === ++doneCnt)
        closeDB();
    }

    for (var i=0; i < days; ++i) {

      var date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      var d1 = dateAdder.add(date, i, 'days');
      date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      var d2 = dateAdder.add(date, i + 1, 'days');
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
            total: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            keyword: "$_id",
            total: 1,
            date: { $literal: d1.format('YYYY-MM-DD') }
          }
        }
      ], function (err, res) {
        if (err) {
          console.error(err);
        }
        console.log(res);
        doneProc();
      });
    }
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
    countDaily();
  };


  /*
   db.crawledarticles.aggregate([ {$match: {articleAt: {$gte: new Date(2016, 6, 13), $lt: new Date(2016,6,14)}}},  {$group: {_id: "$keyword", total: { $sum: 1}}} ])
   */

}());

