(function () {
  'use strict';

  angular
    .module('dashboard.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Article senders state routing
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'modules/dashboard/client/views/dashboard.client.view.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
}());

