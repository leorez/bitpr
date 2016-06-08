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
        url: '/list/:mailinglistGroupId',
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
      })
      .state('mailinglist.group-list', {
        url: '/group-list',
        templateUrl: 'modules/mailinglist/client/views/group-list-mailinglist.client.view.html',
        controller: 'MailinglistGroupListController',
        controllerAs: 'vm'
      })
      .state('mailinglist.create-group', {
        url: '/create-group',
        templateUrl: 'modules/mailinglist/client/views/form-mailinglist-group.client.view.html',
        controller: 'MailinglistGroupController',
        controllerAs: 'vm',
        resolve: {
          mailinglistGroupResolve: newMailinglistGroup
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


    getMailinglistGroup.$inject = ['$stateParams', 'MailinglistGroupService'];

    function getMailinglistGroup($stateParams, MailinglistGroupService) {
      return MailinglistGroupService.get({
        mailinglistGroupId: $stateParams.mailinglistGroupId
      }).$promise;
    }

    newMailinglistGroup.$inject = ['MailinglistGroupService'];

    function newMailinglistGroup(MailinglistGroupService) {
      return new MailinglistGroupService();
    }
  }
}());

