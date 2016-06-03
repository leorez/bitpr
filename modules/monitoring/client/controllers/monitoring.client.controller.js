(function () {
  'use strict';

  angular
    .module('monitoring')
    .controller('MonitoringController', MonitoringController);

  MonitoringController.$inject = ['$mdDialog', '$scope', 'Authentication', 'CrawledArticles', 'ngProgressFactory', 'clipboard'];

  function MonitoringController($mdDialog, $scope, Authentication, CrawledArticles, ngProgressFactory, clipboard) {
    var vm = this;
    
    vm.selected = [];
    vm.progressbar = ngProgressFactory.createInstance();

    vm.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }

      console.log(JSON.stringify(list));
    };

    vm.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    // 홈페이지 올리기/내리기
    vm.toggleDisplayed = function(crawledArticle) {
      crawledArticle.displayed = !crawledArticle.displayed;
      crawledArticle.$update(function (response) {
      }, function (err) {
        vm.error = err.data.message;
      });
    };

    vm.crawledArticles = function () {
      if (Authentication.user) {
        vm.progressbar.start();

        vm.articles = CrawledArticles.query(function (res) {
          vm.progressbar.complete();
        }, function (err) {
          vm.progressbar.complete(err);
          console.log(err.message);
        });
      }
    };

    vm.closeDialog = function () {
      $mdDialog.hide();
    };

    vm.shareArticle = function ($event) {
      // 선택된 기사 공유하기
      // : 제목과 링크로 구성된 문자열을 만들어 클립보드로 복사한다.
      if (Authentication.user) {
        var selected = vm.selected;
        var text = '';
        angular.forEach(selected, function (item) {
          text += '<p>' + item.title + ' <a href="' + item.url + '">더보기</a></p>';
        });
        console.log(text);

        clipboard.copyText(text);

        var alert = $mdDialog.alert()
          .title('기사링크가 복사되었습니다.')
          .htmlContent('<md-content>' + text + '</md-content>')
          .ok('닫기');

        $mdDialog
          .show(alert)
          .finally(function () {
            alert = undefined;
          });
      }
    };
  }
}());

