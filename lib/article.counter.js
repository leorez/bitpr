(function () {
  'use strict';
  require('./../modules/users/server/models/user.server.model.js');
  require('./../modules/users/server/models/crawled-article.server.model.js');
  require('./../modules/dashboard/server/models/count-daily.server.model.js');

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

      var d1 = _.clone(dateAdder.add(date, i, 'day'));
      var d2 = _.clone(dateAdder.add(d1, 1, 'day'));
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

