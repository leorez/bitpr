'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CrawledArticle = mongoose.model('CrawledArticle'),
  Deferred = require('deferred-js'),
  dateAdder = require('add-subtract-date'),
  request = require('request');
require('date-format-lite');

exports.searchFromMedog = function (keyword, since) {
  var def = new Deferred();
  // 아티클 검색: 서버사이드에서 medog api를 이용하여 기사를 검색한 json을 넘겨준다.
  // http://www.medog.kr/api_v1/news/naver_api
  // Params ->
  //		key: 62509358aad6783c7b12047f8ad4a283719d1c91
  //		keyword: 검색 키워드
  //		except_words: 현재 여기에 값을 넣으면 데이타가 넘오오지 않음
  //		since: ~ 이후 데이타 (format: 2016-04-16 13:27:11)
  //		uni_except_words: 'y' ( 현재 'y'로 고정)

  Date.masks.default = 'YYYY-MM-DD hh:mm:ss';

  if (typeof since === 'undefined' || since === '') {
    var t = dateAdder.subtract(new Date(), 3, 'day');
    since = t.format();
  }

  var formData = {
    key: '62509358aad6783c7b12047f8ad4a283719d1c91',
    keyword: keyword,
    except_words: '',
    since: since,
    uni_except_words: 'y'
  };

  var options = {
    url: 'http://www.medog.kr/api_v1/news/naver_api',
    form: formData,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  };

  request.post(options, function (error, response, body) {
    if (error) {
      def.reject(error);
    } else {
      def.resolve(body);
    }
  });

  return def.promise();
};
