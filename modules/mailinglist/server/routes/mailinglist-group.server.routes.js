'use strict';

/**
 * Module dependencies
 */
var mailinglistGroup = require('../controllers/mailinglist-group.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/mailinglist-group')
    .get(mailinglistGroup.list)
    .post(mailinglistGroup.create);

  // Single article routes
  app.route('/api/mailinglist-group/:mailinglistGroupId')
    .get(mailinglistGroup.read)
    .put(mailinglistGroup.update)
    .delete(mailinglistGroup.delete);

  // Finish by binding the article middleware
  app.param('mailinglistGroupId', mailinglistGroup.mailinglistGroupByID);
};
