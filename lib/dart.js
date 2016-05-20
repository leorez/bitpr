(function () {
  'use strict';
  var request = require('request');
  var apikey = '8fe9565007f1da895e18858dda74b4ac56d77c58';

  exports.search = function (options, callback) {
    options.auth = apikey;

    request
      .post('http://dart.fss.or.kr/api/search.json', { form: options }, function (error, response, body) {
        var data = JSON.parse(body);
        if (!error) {
          console.log(data.err_code);
          if (data.err_code !== '000') {
            callback(data);
            return;
          }
          callback(error, data);
        } else {
          callback(error);
        }
      });
  };

  exports.company = function (options, callback) {
    options.auth = apikey;
    request.post('http://dart.fss.or.kr/api/company.json', { form: options }, function (error, response, body) {

      var data = JSON.parse(body);
      if (!error) {
        console.log(data.err_code);
        if (data.err_code !== '000') {
          callback(data);
          return;
        }
        callback(error, data);
      } else {
        callback(error);
      }
    });
  };
}());
