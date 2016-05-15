(function () {
  'use strict';
  var module = angular.module('article-senders');

  module.filter('reserveTime', function () {
    return function (input) {
      if (input === 0) return '즉시';
      else if (input === 999) return '공시확인후';
      else return input + '시간후';
    };
  });

  module.filter('status', function () {
    return function (input) {
      switch (input) {
        case 'None':
          return '작성중';
        case 'Reserved':
          return '발송대기';
        case 'Canceled':
          return '발송취소';
        case 'Sent':
          return '발송완료';
        case 'Error':
          return '발송에러';
        default:
          return '';
      }
    };
  });
}());

