(function () {
  'use strict';

  angular
    .module('reporters.admin')
    .controller('ReportersListController', ReportersListController);

  ReportersListController.$inject = ['ReportersService', '$mdDialog', '$state'];

  function ReportersListController(ReportersService, $mdDialog, $state) {
    var vm = this;
    vm.remove = remove;

    vm.reporters = ReportersService.query();

    // Remove existing Repoter
    function remove(reporter) {
      var confirm = $mdDialog.confirm()
        .textContent('삭제하시겠습니까?')
        .ok('예')
        .cancel('아니요');
      $mdDialog.show(confirm).then(function () {
        reporter.$remove($state.reload());
      });
    }
  }
}());

