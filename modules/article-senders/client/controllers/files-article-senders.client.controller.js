(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersFilesController', ArticleSendersFilesController);

  ArticleSendersFilesController.$inject = ['$scope', '$http', 'FileSaver', 'Blob', 'ArticleSendersService', '$mdDialog'];

  function ArticleSendersFilesController($scope, $http, FileSaver, Blob, ArticleSendersService, $mdDialog) {
    var vm = this;
    vm.downloadDoc = downloadDoc;
    vm.downloadImage = downloadImage;
    vm.reSendArticle = reSendArticle;
    vm.articleSenders = ArticleSendersService.query();
    vm.articleSelected = [];
    vm.fileSelected = [];

    function reSendArticle() {
      console.log('reSendArticle');
      $http.post('/api/re-send-article', vm.articleSelected).then(function (resp) {
        console.log(resp);
        vm.success = resp.data.message;
      }, function (err) {
        console.error(err);
        vm.err = '에러가 발생하였습니다.';
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

