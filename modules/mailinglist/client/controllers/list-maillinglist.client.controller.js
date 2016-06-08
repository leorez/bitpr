(function () {
  'use strict';

  angular
    .module('articles')
    .controller('MailinglistListController', MailinglistListController);

  MailinglistListController.$inject = ['Authentication', '$window', 'MailinglistListService', '$stateParams', '$http'];

  function MailinglistListController(Authentication, $window, MailinglistListService, $stateParams, $http) {
    var vm = this;
    vm.user = Authentication.user;
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

    MailinglistListService.get({ mailinglistGroupId: $stateParams.mailinglistGroupId }, function (data) {
      console.log(JSON.stringify(data));
      vm.mailinglistGroup = data.mailinglistGroup;
      vm.items = data.items;
    });

    vm.removeSelected = function () {
      if ($window.confirm('삭제하시겠습니까?')) {
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
      }
    };
  }
}());
