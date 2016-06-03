(function () {
  'use strict';

  angular
    .module('users')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', '$scope', '$http', '$location', 'UsersService', 'Authentication', 'ngProgressFactory', '$mdDialog'];

  function SettingsController($state, $scope, $http, $location, UsersService, Authentication, ngProgressFactory, $mdDialog) {
    var vm = this;

    vm.user = Authentication.user;
    $scope.user = Authentication.user;

    // If user is not signed in then redirect back home
    if (!$scope.user) $location.path('/');
    
    $scope.getConfig = function () {
      $scope.user = Authentication.user;
      $scope.mList = [];
      _.range(0, 6).forEach(function (i) {
        $scope.mList.push(i * 10);
      });
      $scope.hList = _.range(0, 24);

      if ($scope.user.crawlTimeHour === undefined) $scope.user.crawlTimeHour = 0;
      if ($scope.user.crawlTimeMinutes === undefined) $scope.user.crawlTimeMinutes = 0;

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
  }
}());
