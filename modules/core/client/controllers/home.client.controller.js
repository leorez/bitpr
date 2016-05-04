(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController($scope, $http, Authentication, ngProgressFactory, $stateParams) {
    var vm = this;

    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.resultArticles = [];
    $scope.progressbar = ngProgressFactory.createInstance();

    // for test -------------------------------
    $scope.resultArticles = [];
    // ----------------------------------------

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
