(function () {
  'use strict';

  angular
    .module('article-senders.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Article senders state routing
    $stateProvider
      .state('article-senders', {
        abstract: true,
        url: '/article-senders',
        template: '<ui-view/>'
      })
      .state('article-senders.list', {
        url: '',
        templateUrl: 'modules/article-senders/client/views/article-senders.client.view.html',
        controller: 'ArticleSendersListController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        }
      })
      .state('article-senders.create', {
        url: '/create',
        templateUrl: 'modules/article-senders/client/views/create-article-sender.client.view.html',
        controller: 'ArticleSendersController',
        controllerAs: 'vm',
        resolve: {
          articleSenderResolve: newArticleSender
        },
        data: {
          roles: ['user']
        }
      })
      .state('article-senders.edit', {
        url: '/:articleSenderId/edit',
        templateUrl: 'modules/article-senders/client/views/edit-article-sender.client.view.html',
        controller: 'ArticleSendersController',
        controllerAs: 'vm',
        resolve: {
          articleSenderResolve: getArticleSender
        },
        data: {
          roles: ['user']
        }
      })
      .state('article-senders.preview', {
        url: '/:articleSenderId',
        templateUrl: 'modules/article-senders/client/views/preveiw-article-sender.client.view.html',
        controller: 'ArticleSendersController',
        controllerAs: 'vm',
        resolve: {
          articleSenderResolve: getArticleSender
        },
        data: {
          roles: ['user']
        }
      });

    getArticleSender.$inject = ['$stateParams', 'ArticleSendersService'];

    function getArticleSender($stateParams, ArticleSendersService) {
      return ArticleSendersService.get({
        articleSenderId: $stateParams.articleSenderId
      }).$promise;
    }

    newArticleSender.$inject = ['ArticleSendersService'];

    function newArticleSender(ArticleSendersService) {
      return new ArticleSendersService();
    }
  }
}());

