(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve'];

  function UserController($scope, $state, $window, Authentication, user) {
    var vm = this;
    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;

    vm.onClickConfirmed = function ($event) {
      function emptyRoles(roles) {
        roles.forEach(function (role) {
          vm.user.roles.splice(vm.user.roles.indexOf(role), 1);
        });
      }

      function pushRole(role) {
        vm.user.roles.push(role);
        angular.element(document.getElementById('roles')).val(vm.user.roles.join(','));
      }

      if (vm.user.corpCodeConfirmed && vm.user.emailConfirmed && vm.user.telephoneConfirmed) {
        emptyRoles(['guest', 'user']);
        pushRole('user');
      } else {
        emptyRoles(['guest', 'user', 'admin']);
        pushRole('guest');
      }
    };

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        vm.error = errorResponse.data.message;
      });
    }
  }
}());
