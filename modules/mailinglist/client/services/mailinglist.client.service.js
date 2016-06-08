(function () {
  'use strict';

  angular
    .module('mailinglist.services')
    .factory('MailinglistService', MailinglistService)
    .factory('MailinglistListService', MailinglistListService);

  MailinglistService.$inject = ['$resource'];

  function MailinglistService($resource) {
    return $resource('api/mailinglist/:mailinglistId/:mailinglistGroupId', {
      mailinglistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  MailinglistListService.$inject = ['$resource'];

  function MailinglistListService($resource) {
    return $resource('api/mailinglist/list/:mailinglistGroupId', {
      mailinglistGroupId: '@_id'
    });
  }
}());
