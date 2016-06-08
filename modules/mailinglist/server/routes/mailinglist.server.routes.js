'use strict';

/**
 * Module dependencies
 */
var mailinglist = require('../controllers/mailinglist.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/mailinglist')
    .get(mailinglist.list)
    .post(mailinglist.create);

  // Single article routes
  app.route('/api/mailinglist/:mailinglistId')
    .get(mailinglist.read)
    .put(mailinglist.update)
    .delete(mailinglist.delete);

  // Finish by binding the article middleware
  app.param('mailinglistId', mailinglist.mailinglistByID);
};
