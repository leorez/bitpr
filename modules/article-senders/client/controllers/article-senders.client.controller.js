(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersController', ArticleSendersController);

  ArticleSendersController.$inject = ['$scope', '$state', 'articleSenderResolve', '$stateParams', '$location', 'Authentication', 'ArticleSendersService', 'Upload'];

  function ArticleSendersController($scope, $state, articleSender, $stateParams, $location, Authentication, ArticleSendersService, Upload) {
    var vm = this;

    vm.articleSender = articleSender;
    vm.authentication = Authentication;
    vm.articleSender.reserveTimes = _.range(1, 24);
    vm.articleSender.sendCounts = [1, 2, 4, 6, 8, 10];
    vm.articleSender.reserveTime = 1;
    vm.articleSender.sendCount = 1;
    vm.articleSender.beToDart = true;
    vm.articleSender.fare = 500000;
    vm.articleSender.contentType = 'inputContent';
    /* 보도자료 내용 입력방법 직졉입력(inputContent)/ 파일업로드(uploadFile) */

    vm.bill = bill;
    vm.onSendCountChanged = onSendCountChanged;
    vm.update = update;
    vm.remove = remove;

    function onSendCountChanged() {
      var defaultFare = 500000;
      if (vm.articleSender.sendCount === 1) {
        vm.articleSender.fare = defaultFare;
      } else {
        vm.articleSender.fare = defaultFare + vm.articleSender.sendCount / 2 * 300000;
      }
    }

    function bill(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleSenderForm');
        return false;
      }

      if (vm.articleSender.contentType === 'inputContent') {
        vm.articleSender.file = '';
      } else {
        vm.articleSender.content = '';
      }

      var articleSenders = new ArticleSendersService({
        title: vm.articleSender.title,
        reserveTime: vm.articleSender.reserveTime,
        beToDart: vm.articleSender.beToDart,
        sendCount: vm.articleSender.sendCount,
        fare: vm.articleSender.fare
      });

      if (isValid && vm.articleSender.file) {
        articleSenders.file = vm.articleSender.file;
        articleSenders.user = Authentication.user._id;

        Upload.upload({
          url: '/api/article-senders',
          method: 'POST',
          data: articleSenders
        }).then(function (resp) {
          $location.path(resp.data._id);
          vm.title = '';
          vm.content = '';
        }, function (resp) {
          console.log('Error status: ' + resp.status);
          console.log(resp.data.message);
          vm.error = resp.data.message;
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

      } else {
        articleSenders.content = vm.articleSender.content.replace(/\n/g, "<br />");
        articleSenders.$save(function (response) {
          $location.path(response._id);
          vm.articleSender.title = '';
          vm.articleSender.content = '';
        }, function (err) {
          vm.error = err.data.message;
        });
      }
    }

    function update() {
      var articleSender = vm.articleSender;

      articleSender.$update(function () {
        $location.path(articleSender._id);
      }, function (err) {
        vm.error = err.data.message;
      });
    }

    function remove(articleSender) {
      if (articleSender) {
        articleSender.$remove();

        for (var i in vm.articleSenders) {
          if (vm.articleSenders[i] === articleSender) {
            vm.articleSenders.splice(i, 1);
          }
        }
      } else {
        vm.articleSender.$remove(function () {
          $location.path('');
        });
      }
    }
  }
}());
