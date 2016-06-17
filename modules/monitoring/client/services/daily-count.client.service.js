/**
 * Created by noruya on 16. 4. 26.
 */
'use strict';

angular.module('monitoring.services').factory('DailyCount', ['$resource',
  function ($resource) {
    return $resource('api/daily-count', {
      dailyCountId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
