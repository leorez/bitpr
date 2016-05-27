(function () {
  'use strict';

  angular
    .module('reporters.admin.services')
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
