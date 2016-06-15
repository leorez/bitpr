(function () {
  'use strict';

  angular
    .module('users')
    .controller('EditProfileController', EditProfileController);

  EditProfileController.$inject = ['$uibModal', '$scope', '$http', '$location', 'UsersService', 'Authentication'];

  function EditProfileController($uibModal, $scope, $http, $location, UsersService, Authentication) {
    var vm = this;

    vm.user = Authentication.user;
    vm.updateUserProfile = updateUserProfile;
    vm.emailConfirm = emailConfirm;

    /*
     상장코드인증
     */
    vm.authCorpCode = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'modules/users/client/views/authentication/auth-corpcode-dialog.tmpl.html',
        controller: 'AuthCorpCodeDlgController'
      });

      modalInstance.result.then(function (res) {
        if (res && res.error) {
          vm.user.corpCodeConfirmed = false;
          vm.authCorpError = res.error;
        } else {
          vm.user.corpInfo = res;
          vm.user.corpCodeConfirmed = true;
          vm.user.corpCode = res.corpCode;
          vm.user.corpName = res.crp_nm_i;
          vm.user.telephone = res.phn_no;
        }
      }, function (error) {
        // on cancel
        vm.authCorpError = error;
        if (error) vm.user.corpCodeConfirmed = false;
      });
    };

    function getEmailConfirmed(callback) {
      $http.post('/api/emailconfirmed', { email: vm.user.email }, { withCredentials: true }).success(function (response) {
        callback(null, response);
      }).error(function (err) {
        callback(err);
      });
    }

    function updateConfirmMessage() {
      getEmailConfirmed(function (err, response) {
        if (!err) {
          vm.user.emailConfirmed = response.emailConfirmed;
          console.log('emailConfirmed: ' + response.emailConfirmed);
          var invalidCorpcode = (vm.user.corpCode && /^\d{6}|\d{8}$/.test(vm.user.corpCode) === false);
          if (invalidCorpcode) {
            vm.user.corpCode = '';
          }

          if (invalidCorpcode || !vm.user.emailConfirmed) {
            if (vm.user.provider !== 'local')
              vm.message = vm.user.provider.toUpperCase() + ' 계정으로 로그인되었습니다. 정식으로 사용하시려면 ';

            if (invalidCorpcode && !vm.user.emailConfirmed) {
              vm.message += '이메일 및 상장코드 민증이 필요합니다.';
            } else if (!vm.user.emailConfirmed) {
              vm.message += '이메일 인증이 필요합니다.';
            } else if (invalidCorpcode) {
              vm.message += '상장코드 인증이 필요합니다.';
            }
          } else {
            vm.message = '';
          }
        } else {
          vm.message = err;
        }
      });
    }

    updateConfirmMessage();

    // 이메일 인증
    function emailConfirm() {
      vm.success = vm.error = null;
      $http.post('/ea/request', { email: vm.user.email }, { withCredentials: true }).success(function (response) {
        vm.success = '인증 이메일이 발송되었습니다.';
      }).error(function (error) {
        vm.error = error.message;
      });
    }

    // Update a user profile
    function updateUserProfile(isValid) {
      vm.success = vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        return false;
      }

      var user = new UsersService(vm.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'vm.userForm');

        vm.success = '저장되었습니다.';
        vm.user = Authentication.user = response;
        console.log(vm.user);
        updateConfirmMessage();
      }, function (response) {
        vm.error = response.data.message;
      });
    }
  }
}());
