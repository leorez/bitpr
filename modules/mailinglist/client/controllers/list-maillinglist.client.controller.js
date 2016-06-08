(function () {
  'use strict';

  angular
    .module('articles')
    .controller('MailinglistListController', MailinglistListController);

  MailinglistListController.$inject = ['MailinglistService'];

  function MailinglistListController(MailinglistService) {
    var vm = this;

    vm.items = MailinglistService.query();
  }
}());
