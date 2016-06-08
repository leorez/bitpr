(function () {
  'use strict';

  angular
    .module('mailinglist')
    .controller('MailinglistGroupController', MailinglistGroupController);

  MailinglistGroupController.$inject = ['$location', 'MailinglistGroupService', '$scope', '$state', 'mailinglistGroupResolve', '$window', 'Authentication'];

  function MailinglistGroupController($location, MailinglistGroupService, $scope, $state, mailinglistGroup, $window, Authentication) {
    var vm = this;

    vm.mailinglistGroup = mailinglistGroup;
    vm.authentication = Authentication;
    vm.user = Authentication.user;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.message = null;
    vm.items = [];

    function remove() {
      if ($window.confirm('삭제하시셌습니까?')) {
        vm.mailinglistGroup.$remove($state.go('mailinglist.group-list'));
      }
    }

    function save(isValid) {
      vm.error = null;
      vm.success = null;

      if (vm.mailinglistGroup._id) {
        vm.mailinglistGroup.$update(successCallback, errorCallback);
      } else {
        vm.mailinglistGroup.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mailinglist.group-list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
