/**
 * Created by noruya on 16. 4. 26.
 */
'use strict';

angular.module('users.services').factory('CrawledArticles', ['$resource',
  function ($resource) {
    return $resource('api/crawled-articles/:crawledArticleId', {
      crawledArticleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
