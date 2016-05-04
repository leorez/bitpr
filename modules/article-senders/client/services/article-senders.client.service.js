(function () {
  'use strict';

  angular
    .module('article-senders.services')
    .factory('ArticleSendersService', ArticleSendersService);

  ArticleSendersService.$inject = ['$resource'];

  function ArticleSendersService($resource) {
    return $resource('api/article-senders/:articleSenderId', {
      articleSenderId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
