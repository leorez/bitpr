(function () {
  'use strict';
  angular
    .module('users')
    .controller('AuthCorpCodeDlgController', AuthCorpCodeDlgController);
  AuthCorpCodeDlgController.$inject = ['ArticleSendersMethodsService', '$scope', '$uibModalInstance'];
  /*
   상장코드 인증용 대화창 콘트롤러
   */
  function AuthCorpCodeDlgController(ArticleSendersMethodsService, $scope, $uibModalInstance) {
    $scope.corpCode = '';
    $scope.result = { error: null };
    $scope.auth = function () {
      ArticleSendersMethodsService.dartCorpInfo($scope.corpCode,
        function (error, data) {
          if (error) {
            /* ---------------------------------
              local test 용 (dart에 실서버에서만 api허용)
            ----------------------------------- */
            $scope.success = true;
            $scope.result = {
              crp_nm: '(주) 비트피알',
              crp_nm_i: '비트피알',
              adr: '서울시 마포구 독막로 331 22F(도화동, 마스터즈타워)',
              hm_url: 'http://www.bitpr.kr',
              crp_no: '211-2345-23',
              phn_no: '02-2134-5678',
              est_dt: '20160601',
              corpCode: $scope.corpCode
            };
            /* ---------------------------------
             local test 용 (dart에 실서버에서만 api허용)
             ----------------------------------- */

            // $scope.success = false;
            // $scope.result.error = '인증에 실패하였습니다. 상장코드를 확인해 주세요.';
          } else {
            $scope.success = true;
            delete $scope.result.error;
            $scope.result = data;
            $scope.result.corpCode = $scope.corpCode;
          }
        }
      );
    };

    $scope.onEnters = function ($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        // on enter key
        $scope.auth();
      }
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss($scope.result.error);
    };
    // 선택된 파일공유 : 이메일 입력후 전송하기
    $scope.ok = function () {
      $uibModalInstance.close($scope.result);
    };
  }

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$uibModal', '$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator'];

  function AuthenticationController($uibModal, $scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.email = $state.params.email;
    vm.credentials = { corpCodeConfirmed: false };
    vm.telephone = $location.search().telephone;

    if ($location.search().result === 'success-signup') {
      vm.success = '회원등록이 완료되었습니다.';
    }

    // Get an eventual error defined in the URL query string:
    vm.error = $location.search().err;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

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
          vm.credentials.corpCodeConfirmed = false;
          vm.authCorpError = res.error;
        } else {
          vm.credentials.corpInfo = res;
          vm.credentials.corpCodeConfirmed = true;
          vm.credentials.corpCode = res.corpCode;
          vm.credentials.corpName = res.crp_nm_i;
          vm.credentials.telephone = res.phn_no;
        }
      }, function (error) {
        // on cancel
        vm.authCorpError = error;
        if (error) vm.credentials.corpCodeConfirmed = false;
      });
    };

    function signup(isValid) {
      vm.error = null;

      if (!vm.credentials.corpCodeConfirmed) {
        vm.error = '상장코드 인증이 필요합니다.';
        return false;
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signup', vm.credentials).success(function (response) {
        // And redirect to the previous or home page
        $state.go('authentication.emailauthinfo');
      }).error(function (response) {
        vm.error = response.message;
      });
    }

    function signin(isValid) {
      vm.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      $http.post('/api/auth/signin', vm.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        vm.authentication.user = response;
        // And redirect to the previous or home page
        if ($state.previous.state.name === 'home') {
          $state.go('dashboard');
        } else {
          $state.go($state.previous.state.name || 'dashboard', $state.previous.params);
        }
      }).error(function (response) {
        console.log(response);
        vm.error = response.message;
      });
    }

    // OAuth provider request
    function callOauthProvider(url) {
      console.log($state.previous.href);
      if ($state.previous && $state.previous.href === '/')
        $state.previous.href = '/dashboard';

      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      console.log(url);
      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }
  }
}());
