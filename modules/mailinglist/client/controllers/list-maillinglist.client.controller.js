(function () {
  'use strict';

  angular
    .module('articles')
    .controller('MailinglistListController', MailinglistListController);

  MailinglistListController.$inject = ['MailinglistListService', '$stateParams', '$http'];

  function MailinglistListController(MailinglistListService, $stateParams, $http) {
    var vm = this;
    vm.selected = [];

    vm.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };

    vm.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    vm.items = MailinglistListService.query({ mailinglistGroupId: $stateParams.mailinglistGroupId });

    vm.removeSelected = function () {
      $http.post('/api/mailinglist/remove-lists', { items: vm.selected })
        .success(function (res) {
          var i = -1;
          vm.selected.forEach(function (item) {
            i = vm.items.indexOf(item);
            if (i !== -1)
              vm.items.splice(i, 1);
          });
        })
        .error(function (err) {
          vm.error = err.message;
        });
    };
  }
}());
