(function () {
  'use strict';

  angular
    .module('reporters.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.reporters', {
        url: '/reporters',
        templateUrl: 'modules/reporters/client/views/list-reporters.client.view.html',
        controller: 'ReportersListController',
        controllerAs: 'vm'
      })
      .state('admin.reporters-create', {
        url: '/reporters/create',
        templateUrl: 'modules/reporters/client/views/form-reporter.client.view.html',
        controller: 'ReportersController',
        controllerAs: 'vm',
        resolve: {
          reporterResolve: newReporter
        }
      })
      .state('admin.reporters-edit', {
        url: '/reporters/:reporterId/edit',
        templateUrl: 'modules/reporters/client/views/form-reporter.client.view.html',
        controller: 'ReportersController',
        controllerAs: 'vm',
        resolve: {
          reporterResolve: getReporter
        },
        data: {
          roles: ['admin']
        }
      });
  }

  getReporter.$inject = ['$stateParams', 'ReportersService'];

  function getReporter($stateParams, ReportersService) {
    return ReportersService.get({
      reporterId: $stateParams.reporterId
    }).$promise;
  }

  newReporter.$inject = ['ReportersService'];

  function newReporter(ReportersService) {
    return new ReportersService();
  }
}());
