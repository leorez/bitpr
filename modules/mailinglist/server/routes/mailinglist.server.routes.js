'use strict';

/**
 * Module dependencies
 */
var mailinglist = require('../controllers/mailinglist.server.controller');
var mailinglistGroup = require('../controllers/mailinglist-group.server.controller');

module.exports = function (app) {
  app.route('/api/mailinglist/list/:mailinglistGroupId')
    .get(mailinglist.list);

  app.route('/api/mailinglist')
    .post(mailinglist.create);

  // Single article routes
  app.route('/api/mailinglist/:mailinglistId')
    .get(mailinglist.read)
    .put(mailinglist.update)
    .delete(mailinglist.delete);

  // Finish by binding the article middleware
  app.param('mailinglistId', mailinglist.mailinglistByID);
  app.param('mailinglistGroupId', mailinglistGroup.mailinglistGroupByID);
};
