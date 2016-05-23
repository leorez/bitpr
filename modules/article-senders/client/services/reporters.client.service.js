(function () {
  'use strict';

  angular
    .module('article-senders.services')
    .factory('ReportersService', ReportersService);

  ReportersService.$inject = ['$resource'];

  function ReportersService($resource) {
    return $resource('api/reporters/:reporterId', {
      reporterId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
