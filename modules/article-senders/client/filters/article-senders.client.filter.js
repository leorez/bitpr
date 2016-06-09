(function () {
  'use strict';
  var module = angular.module('article-senders');

  module.filter('displayed', function () {
    return function (displayed) {
      if (displayed) return '게시중';
      else return '게시하기';
    };
  });

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
          return '-';
        case 'Reserved':
          return '발송대기';
        case 'Canceled':
          return '발송취소';
        case 'Sent':
          return '발송완료';
        case 'Error':
          return '발송에러';
        case 'ReSend':
          return '재발송중';
        case 'Temporary':
          return '임시저장';
        default:
          return '';
      }
    };
  });

  module.filter('summary', function () {
    return function (input) {
      return input.summary(250);
    };
  });

  // len만큼 요약된 문자열 반환
  /* eslint-disable */
  String.prototype.summary = function(len) {
    function stripHTML(html) {
      var tmp = document.implementation.createHTMLDocument("New").body;
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }
    return stripHTML(this.substring(0, len || 200)) + '...';
  };
  /* eslint-disable */
}());

