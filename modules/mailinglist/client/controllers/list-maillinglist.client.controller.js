(function () {
  'use strict';

  angular
    .module('articles')
    .controller('MailinglistListController', MailinglistListController);

  MailinglistListController.$inject = ['MailinglistListService', '$stateParams'];

  function MailinglistListController(MailinglistListService, $stateParams) {
    var vm = this;

    vm.items = MailinglistListService.query({ mailinglistGroupId: $stateParams.mailinglistGroupId });
  }
}());
