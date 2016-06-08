(function () {
  'use strict';

  angular
    .module('mailinglist.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Article senders state routing
    $stateProvider
      .state('mailinglist', {
        abstract: true,
        url: '/mailinglist',
        template: '<ui-view/>'
      })
      .state('mailinglist.list', {
        url: '',
        templateUrl: 'modules/mailinglist/client/views/list-mailinglist.client.view.html',
        controller: 'MailinglistListController',
        controllerAs: 'vm'
      })
      .state('mailinglist.success', {
        url: '/success/:mailinglistId',
        templateUrl: 'modules/mailinglist/client/views/success-mailinglist.client.view.html',
        controller: 'MailinglistController',
        controllerAs: 'vm',
        resolve: {
          mailinglistResolve: getMailinglist
        }
      })
      .state('mailinglist.create', {
        url: '/create',
        templateUrl: 'modules/mailinglist/client/views/form-mailinglist.client.view.html',
        controller: 'MailinglistController',
        controllerAs: 'vm',
        resolve: {
          mailinglistResolve: newMailinglist
        }
      });

    getMailinglist.$inject = ['$stateParams', 'MailinglistService'];

    function getMailinglist($stateParams, MailinglistService) {
      return MailinglistService.get({
        mailinglistId: $stateParams.mailinglistId
      }).$promise;
    }

    newMailinglist.$inject = ['MailinglistService'];

    function newMailinglist(MailinglistService) {
      return new MailinglistService();
    }
  }
}());

