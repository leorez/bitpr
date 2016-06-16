(function () {
  'use strict';

  angular
    .module('core')
    .controller('TypeSelectDlgController', TypeSelectDlgController);
  TypeSelectDlgController.$inject = ['$scope', '$uibModalInstance'];
  function TypeSelectDlgController($scope, $uibModalInstance) {
    $scope.types = ['신제품', '신사업', '실적', '기타'];
    $scope.selected = '신제품';
    $scope.select = function (type) {
      $scope.selected = type;
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
    // 선택된 파일공유 : 이메일 입력후 전송하기
    $scope.ok = function () {
      $uibModalInstance.close($scope.selected);
    };
  }
  
  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$uibModal', '$scope', '$state', 'Authentication', 'menuService'];

  function HeaderController($uibModal, $scope, $state, Authentication, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    vm.goCreateArticleSender = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/article-senders/client/views/select-article-sender-type-dialog.tmpl.html',
        controller: 'TypeSelectDlgController',
        size: 'sm'
      });

      modalInstance.result.then(function (type) {
        $state.go('article-senders.create', { type: type });
      }, function () {
        // on cancel
      });
    };
  }
}());
