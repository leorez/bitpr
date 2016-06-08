(function () {
  'use strict';

  angular
    .module('mailinglist.services')
    .factory('MailinglistService', MailinglistService);

  MailinglistService.$inject = ['$resource'];

  function MailinglistService($resource) {
    return $resource('api/mailinglist/:mailinglistId', {
      mailinglistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
