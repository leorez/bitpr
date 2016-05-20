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

  exports.searchMockTest = function (options, callback) {
    var error;
    var data = {
      err_code: '000',
      err_msg: '성공',
      page_no: 1,
      page_set: 10,
      total_count: 1,
      total_page: 1,
      list: [{
        crp_cls: 'Y',
        crp_nm: '삼성전자',
        crp_cd: '005930',
        rpt_nm: '기재정정',
        rcp_no: '007',
        flr_nm: '삼성관리자',
        rcp_dt: new Date().format('YYYYMMDD'),
        rmk:'유'
      }]
    };
    callback(error, data);
  }
}());
