(function () {
  'use strict';

  angular
    .module('mailinglist.services')
    .factory('MailinglistGroupService', MailinglistGroupService);

  MailinglistGroupService.$inject = ['$resource'];

  function MailinglistGroupService($resource) {
    return $resource('api/mailinglist-group/:mailinglistGroupId', {
      mailinglistGroupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
