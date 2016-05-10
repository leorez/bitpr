(function () {
  'use strict';

  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', '$http', '$location', 'UsersService', 'Authentication', 'DisplayedArticles', 'CrawledArticles', 'ngProgressFactory', 'clipboard', '$mdDialog'];

  function SettingsController($scope, $http, $location, UsersService, Authentication, DisplayedArticles, CrawledArticles, ngProgressFactory, clipboard, $mdDialog) {
    var vm = this;

    vm.user = Authentication.user;

    $scope.user = Authentication.user;
    $scope.resultArticles = [];
    $scope.selected = [];
    $scope.progressbar = ngProgressFactory.createInstance();

    // If user is not signed in then redirect back home
    if (!$scope.user) $location.path('/');

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

    $scope.getConfig = function () {
      console.log('getConfig'+JSON.stringify(Authentication.user));
      $scope.user = Authentication.user;
      $scope.mList = [];
      _.range(0, 6).forEach(function (i) {
        $scope.mList.push(i * 10);
      });
      $scope.hList = _.range(0, 24);

      if ($scope.user.crawlTimeHour === undefined) $scope.user.crawlTimeHour = 0;
      if ($scope.user.crawlTimeMinutes === undefined) $scope.user.crawlTimeMinutes = 0;

      console.log($scope.user);

      if (typeof $scope.user.keywords === 'string' && $scope.user.keywords !== '') {
        var keywords = $scope.user.keywords.split(',');
        $scope.keywords = [];
        keywords.forEach(function (keyword) {
          $scope.keywords.push({ text: keyword });
        });
      }
    };

    $scope.saveConfig = function () {
      $scope.success = $scope.error = null;

      if (Authentication.user) {
        var tags = [];
        angular.forEach($scope.keywords, function (value) {
          tags.push(value.text);
        });

        $scope.user.keywords = tags.join(',');
        $scope.user.enabledCrawler = true;

        var user = new UsersService($scope.user);

        user.$update(function (response) {
          $scope.success = true;
          vm.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      }

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
            articleAt: item.articleAt
          });

          console.log('article: ' + JSON.stringify(article));

          article.$save(function (response) {
            console.log('success:' + response);
            $location.path('/settings/displayed-list');

          }, function (errorRespose) {
            $scope.error = errorRespose.data.message;
            console.log('failed: ' + $scope.error);
            console.log(JSON.stringify(errorRespose));
          });
        });
      }
    };

    $scope.crawledArticles = function () {
      if (Authentication.user) {
        $scope.progressbar.start();

        $scope.articles = CrawledArticles.query(function (res) {
          $scope.progressbar.complete();
        }, function (err) {
          $scope.progressbar.complete(err);
          console.log(err.message);
        });
      }
    };

    $scope.displayedArticles = function () {
      // 홈페이지에 올라간 기사목록 보기
      $scope.success = $scope.error = null;

      if (Authentication.user) {
        $scope.progressbar.start();

        $scope.articles = DisplayedArticles.query(function (res) {
          $scope.progressbar.complete();
        }, function (err) {
          $scope.progressbar.complete(err);
          console.log(err.message);
        });
      }
    };

    $scope.removeDisplayedArticle = function () {
      // 홈페이지에 올린 기사중 선택된것 삭제하기
      if (Authentication.user) {
        var selected = $scope.selected;
        angular.forEach(selected, function (item) {
          item.$remove(function (response) {
            $scope.articles.splice(item, 1);
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
            console.log('failed: ' + $scope.error);
            console.log(JSON.stringify(errorResponse));
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
  }
}());
