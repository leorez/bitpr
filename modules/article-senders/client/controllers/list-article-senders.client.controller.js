/**
 * Created by noruya on 16. 5. 4.
 */
(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersListController', ArticleSendersListController);

  ArticleSendersListController.$inject = ['ArticleSendersService', '$mdDialog', '$http', 'FileSaver'];

  function ArticleSendersListController(ArticleSendersService, $mdDialog, $http, FileSaver) {
    var vm = this;

    vm.articleSenders = ArticleSendersService.query();

    vm.cancelArticleSender = cancelArticleSender;
    vm.downloadImage = downloadImage;
    
    // 보도자료현황의 발송취소
    function cancelArticleSender(articleSender, $http) {
      console.log('clicked');
      var confirm = $mdDialog.confirm()
        .textContent('예약된 보도자료 발송이 취소됩니다. 정말로 취소하시겠습니까?')
        .ok('예')
        .cancel('아니요');
      $mdDialog.show(confirm).then(function () {
        articleSender.status = 'Canceled';
        articleSender.canceled = new Date();
        articleSender.$update(articleSender, function (response) {
          console.log(response);
        }, function (error) {
          articleSender.status = 'Reserved';
          console.error(error);
        });
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
