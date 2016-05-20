(function () {
  'use strict';
  var request = require('request');
  var apikey = '8fe9565007f1da895e18858dda74b4ac56d77c58';

  exports.search = function (options, callback) {
    options.auth = apikey;

    request
      .post('http://dart.fss.or.kr/api/search.json', {form: options}, function (error, response, body) {
        if (!error) {
          if (response.body.err_code !== '000') {
            callback(response.body);
            return;
          }
          callback(error, response.body);
        } else {
          callback(error);
        }
      });
  };

}());

