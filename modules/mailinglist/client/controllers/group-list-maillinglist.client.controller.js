(function () {
  'use strict';

  angular
    .module('articles')
    .controller('MailinglistGroupListController', MailinglistGroupListController);

  MailinglistGroupListController.$inject = ['MailinglistGroupService'];

  function MailinglistGroupListController(MailinglistGroupService) {
    var vm = this;

    vm.items = MailinglistGroupService.query();
  }
}());
