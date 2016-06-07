/**
 * Created by noruya on 16. 4. 26.
 */
'use strict';

angular.module('monitoring.services').factory('CrawledArticles', ['$resource',
  function ($resource) {
    return $resource('api/crawled-articles/:crawledArticleId/:limit/:page/:filter', {
      crawledArticleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
