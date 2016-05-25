(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersFilesController', ArticleSendersFilesController);

  ArticleSendersFilesController.$inject = ['$scope', 'ReportersService', 'Authentication', '$http', 'FileSaver', 'Blob', 'ArticleSendersService', '$mdDialog'];

  function ArticleSendersFilesController($scope, ReportersService, Authentication, $http, FileSaver, Blob, ArticleSendersService, $mdDialog) {
    var vm = this;
    vm.authentication = Authentication;
    vm.downloadDoc = downloadDoc;
    vm.downloadImage = downloadImage;
    vm.reSendArticle = reSendArticle;
    vm.shareFiles = shareFiles;
    vm.toggleDisplayed = toggleDisplayed;
    vm.articleSenders = ArticleSendersService.query();
    vm.articleSelected = [];
    vm.fileSelected = [];
    $scope.emails = [];
    vm.error = '';
    vm.success = '';

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.addEmail = function(email) {
      console.log(email);
      $scope.emails.push(email);
    };

    $scope.removeEmail = function (email) {
      console.log(email);
      $scope.emails.splice($scope.emails.indexOf(email), 1);
    };

    // 선택된 파일공유 : 이메일 입력후 전송하기
    $scope.submitShareFiles = function () {
      $mdDialog.hide($scope.emails);
    };
    
    // 홈페이지 올리기/홈페이지 내리기
    function toggleDisplayed(articleSender) {
      articleSender.displayed = !articleSender.displayed;
      articleSender.$update(function (resp) {
      }, function (err) {
        vm.error = err.data.message;
      });
    }

    // 파일공유
    function shareFiles(ev) {
      vm.error = '';
      vm.success = '';
      console.log('click');
      $mdDialog.show({
        controller: ArticleSendersFilesController,
        templateUrl: 'modules/article-senders/client/views/email-input-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false
      })
      .then(function(emails) {
        var user = vm.authentication.user;

        var data = {
          from: user.displayName + '<' + user.email + '>',
          emails: emails,
          files: vm.fileSelected
        };
        console.log('data : ' + data);

        $http.post('/api/send-files', data).then(function (resp) {
          console.log(resp);
          vm.success = resp.data.message;
        }, function (err) {
          console.error(err.data);
          vm.error = err.data.message;
        });

      }, function() {
        // on cancel
      });
    }

    ReporterSelectDlgController.$inject = ['$scope', '$mdDialog', 'ReportersService'];
    function ReporterSelectDlgController($scope, $mdDialog, ReportersService) {
      $scope.reporters = ReportersService.query();
      $scope.reporterSelected = [];
      $scope.exists = function(item, list) {
        return list.indexOf(item) > -1;
      };

      $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(item);
        }

        console.log(JSON.stringify(list));
      };

      console.log(JSON.stringify($scope.reporters));
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      // 선택된 파일공유 : 이메일 입력후 전송하기
      $scope.submit = function () {
        $mdDialog.hide($scope.reporterSelected);
      };
    }

    // 선택된 자료 재전송
    function reSendArticle(ev) {
      vm.error = '';
      vm.success = '';
      console.log('reSendArticle');
      $mdDialog.show({
        controller: ReporterSelectDlgController,
        templateUrl: 'modules/article-senders/client/views/reporters-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false
      })
      .then(function(reporters) {
        var data = {
          reporters: reporters,
          articleSenders: vm.articleSelected
        };

        $http.post('/api/re-send-article', data).then(function (resp) {
          console.log(resp);
          vm.success = resp.data.message;
        }, function (err) {
          console.error(err);
          vm.error = '에러가 발생하였습니다.';
        });
      }, function () {
        // on cancel
      });


    }

    $scope.exists = function(item, list) {
      return list.indexOf(item) > -1;
    };

    $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }

      console.log(JSON.stringify(list));
    };

    function downloadDoc(file) {
      delete $http.defaults.headers.common['X-Requested-With']; // See note 2
      $http.get('/docs/' + file, { responseType: 'arraybuffer' }).success(function (data) {
        var blob = new Blob([data], { type: 'application/docx' });
        FileSaver.saveAs(blob, file);
      }).error(function (data, status) {
        console.error('Request failed with status: ' + status);
      });
    }

    function downloadImage(file) {
      delete $http.defaults.headers.common['X-Requested-With']; // See note 2
      $http.get('/images/' + file, { responseType: 'arraybuffer' }).success(function (data) {
        var blob = new Blob([data], { type: 'image/jpeg' });
        FileSaver.saveAs(blob, file);
      }).error(function (data, status) {
        console.error('Request failed with status: ' + status);
      });
    }
  }

}());

