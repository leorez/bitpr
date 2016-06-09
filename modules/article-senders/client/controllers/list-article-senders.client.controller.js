/**
 * Created by noruya on 16. 5. 4.
 */
(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersListController', ArticleSendersListController);

  ArticleSendersListController.$inject = ['ArticleSendersMethodsService', 'ngProgressFactory', '$window', '$state', 'ArticleSendersService', '$mdDialog', '$http', 'FileSaver'];

  function ArticleSendersListController(ArticleSendersMethodsService, ngProgressFactory, $window, $state, ArticleSendersService, $mdDialog, $http, FileSaver) {
    var vm = this;
    vm.progressbar = ngProgressFactory.createInstance();
    vm.totalItems = 0;
    vm.itemsPerPage = 10;
    vm.data = { articleSenders: [] };
    vm.maxSize = 5;
    vm.currentPage = 1;
    vm.filter = 'All';
    vm.keyword = '';

    vm.queryItems = function (filter) {
      vm.filter = filter;
      vm.progressbar.start();
      vm.data = ArticleSendersService.get({ limit: vm.itemsPerPage, page: vm.currentPage, filter: filter, keyword: vm.keyword }, function (res) {
        vm.progressbar.complete();
        vm.totalItems = res.counts.totalItems;
        vm.counts = res.counts;
        console.log(res);
      }, function (err) {
        vm.progressbar.complete(err);
      });
    };

    vm.search = function ($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        vm.queryItems(vm.filter);
      }
    };

    vm.queryItems(vm.filter);

    vm.cancelArticleSender = cancelArticleSender;
    vm.downloadImage = downloadImage;

    // 보도자료현황의 발송취소
    function cancelArticleSender(articleSender, $http) {
      if ($window.confirm('예약된 보도자료 발송이 취소됩니다. 취소하시겠습니까?')) {

        articleSender.status = 'Canceled';
        articleSender.canceled = new Date();

        articleSender = new ArticleSendersService(articleSender);
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

    vm.reSendArticle = function (articleSender) {
      ArticleSendersMethodsService.reSendArticle(articleSender);
    };
  }
}());
