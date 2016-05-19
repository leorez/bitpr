(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController($scope, $location, DisplayedArticles, clipboard, $mdDialog, $http, Authentication, ngProgressFactory, $stateParams) {
    var vm = this;

    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.resultArticles = [];
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.selected = [];

    $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }

      console.log(JSON.stringify(list));
    };

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    $scope.displayArticleToHomepage = function () {
      // 선택된 기사 홈페이지에 올리기
      $scope.success = $scope.error = null;

      if (Authentication.user) {
        var selected = $scope.selected;

        angular.forEach(selected, function (item) {
          var article = new DisplayedArticles({
            title: item.title,
            summary: item.summary,
            media: item.media,
            url: item.url,
            articleAt: item.article_at
          });

          console.log('article: ' + JSON.stringify(article));

          article.$save(function (response) {
            console.log('success:' + response);
          }, function (errorRespose) {
            $scope.error = errorRespose.data.message;
            console.log('failed: ' + $scope.error);
            console.log(JSON.stringify(errorRespose));
          });
        });
      }
    };

    $scope.closeDialog = function () {
      $mdDialog.hide();
    };

    $scope.shareArticle = function ($event) {
      // 선택된 기사 공유하기
      // : 제목과 링크로 구성된 문자열을 만들어 클립보드로 복사한다.
      if (Authentication.user) {
        var selected = $scope.selected;
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

    $scope.goSearch = function () {
      console.log($stateParams.corpCode);
      if ($stateParams.corpCode !== undefined) {
        $scope.searchKeyword = $stateParams.corpCode;
      }
      console.log($scope.searchKeyword);

      $scope.resultArticles = [];
      $scope.progressbar.start();
      var req = {
        method: 'POST',
        url: '/search',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        data: { keyword: $scope.searchKeyword }
      };

      $http(req).then(function (res) {
        var jsonData = res;

        if (typeof(jsonData) === 'string') {
          // unit test시 json 변환후 string인경우 다시한번 변환한다.
          jsonData = JSON.parse(jsonData);
        }

        if (jsonData.status === 200) {
          $scope.resultArticles = jsonData.data;
        }

        $scope.progressbar.complete();
      }, function (err) {
        $scope.progressbar.complete();
        console.log(err.message);
      });

    };

    $scope.checkEnter = function ($event) {
      var keyCode = $event.which || $event.keyCode;
      if (keyCode === 13) {
        $scope.goSearch();
      }
    };
  }
}());
