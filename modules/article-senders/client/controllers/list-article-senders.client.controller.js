/**
 * Created by noruya on 16. 5. 4.
 */
(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersListController', ArticleSendersListController);

  ArticleSendersListController.$inject = ['$window', '$state', 'ArticleSendersService', '$mdDialog', '$http', 'FileSaver'];

  function ArticleSendersListController($window, $state, ArticleSendersService, $mdDialog, $http, FileSaver) {
    var vm = this;

    vm.articleSenders = ArticleSendersService.query();

    vm.cancelArticleSender = cancelArticleSender;
    vm.downloadImage = downloadImage;

    // 보도자료현황의 발송취소
    function cancelArticleSender(articleSender, $http) {
      if ($window.confirm('예약된 보도자료 발송이 취소됩니다. 취소하시겠습니까?')) {
        articleSender.status = 'Canceled';
        articleSender.canceled = new Date();

        articleSender.$update(articleSender, function (response) {
          console.log(response);
        }, function (error) {
          articleSender.status = 'Reserved';
          console.error(error);
        });
      }
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

    vm.remove = function (articleSender) {
      if (articleSender) {
        if ($window.confirm('삭제하시겠습니까?')) {
          articleSender.$remove();
          for (var i in vm.articleSenders) {
            if (vm.articleSenders[i] === articleSender) {
              vm.articleSenders.splice(i, 1);
            }
          }
        }
      }
    };
  }
}());
