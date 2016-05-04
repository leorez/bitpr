'use strict';

//Setting up route
angular.module('article-senders').config(['$stateProvider',
	function($stateProvider) {
		// Article senders state routing
		$stateProvider.
		state('article-senders', {
			url: '/article-senders',
			templateUrl: '<ui-view/>'
		}).
		state('article-senders.edit', {
			url: '/:articleSenderId/edit',
			templateUrl: 'modules/article-senders/views/edit-article-sender.client.view.html'
		}).
		state('article-senders.preview', {
			url: '/:articleSenderId',
			templateUrl: 'modules/article-senders/views/preveiw-article-sender.client.view.html'
		}).
		state('article-senders.create', {
			url: '/create',
			templateUrl: 'modules/article-senders/client/views/create-article-sender.client.view.html'
		}).
		state('article-senders.list', {
			url: '',
			templateUrl: 'modules/article-senders/client/views/article-senders.client.view.html'
		});
	}
]);
