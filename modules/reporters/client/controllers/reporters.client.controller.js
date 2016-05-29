(function () {
  'use strict';

  angular
    .module('reporters')
    .controller('ReportersController', ReportersController);

  ReportersController.$inject = ['$scope', '$state', 'reporterResolve', '$window', 'Authentication'];

  function ReportersController($scope, $state, reporter, $window, Authentication) {
    var vm = this;

    vm.reporter = reporter;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.save = save;

    // Save Reporter
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reporterForm');
        return false;
      }

      if (vm.reporter._id) {
        vm.reporter.$update(successCallback, errorCallback);
      } else {
        vm.reporter.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('admin.reporters');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
