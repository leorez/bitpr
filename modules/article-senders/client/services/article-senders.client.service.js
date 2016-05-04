'use strict';

angular.module('article-senders').factory('ArticleSenders', ['$resource',
	function($resource) {
		return $resource('api/article-senders/:articleSenderId', {
			articleSenderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
