(function () {
  'use strict';

  // Setting up route
  angular
    .module('monitoring.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('monitoring', {
        abstract: true,
        url: '/monitoring',
        template: '<ui-view/>'
      })
      .state('monitoring.list', {
        url: '',
        templateUrl: 'modules/monitoring/client/views/list-monitoring.client.view.html',
        controller: 'MonitoringController',
        controllerAs: 'vm'
      });
  }
}());
