/**
 * Created by noruya on 16. 4. 24.
 */
'use strict';

angular.module('users.services').factory('DisplayedArticles', ['$resource',
  function ($resource) {
    return $resource('api/displayed-articles/:displayedArticleId', {
      displayedArticleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }]);
