(function () {
  'use strict';

  angular
    .module('mailinglist')
    .controller('MailinglistController', MailinglistController);

  MailinglistController.$inject = ['MailinglistService', '$scope', '$state', 'mailinglistResolve', '$window', 'Authentication'];

  function MailinglistController(MailinglistService, $scope, $state, mailinglist, $window, Authentication) {
    var vm = this;

    vm.mailinglist = mailinglist;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.message = null;
    vm.items = [];

    vm.buildMessage = function() {
      vm.message = vm.mailinglist.email + '로 인증메일이 발송되었습니다.';
    };

    function remove() {
      if ($window.confirm('삭제하시셌습니까?')) {
        vm.mailinglist.$remove($state.go('mailinglists.list'));
      }
    }

    function save(isValid) {
      vm.error = null;
      vm.success = null;

      if (vm.mailinglist._id) {
        vm.mailinglist.$update(successCallback, errorCallback);
      } else {
        vm.mailinglist.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mailinglist.success', { mailinglistId: res._id });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
