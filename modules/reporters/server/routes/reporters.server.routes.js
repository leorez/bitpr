'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  adminPolicy = require(path.resolve('./modules/users/server/policies/admin.server.policy')),
  reporter = require('../controllers/reporters.server.controller');

module.exports = function (app) {
  // Reporters collection routes
  app.route('/api/reporters')
    .get(adminPolicy.isAllowed, reporter.list);

  app.route('/api/reporters/:reporterId')
    .get(adminPolicy.isAllowed, reporter.read)
    .put(adminPolicy.isAllowed, reporter.update)
    .delete(adminPolicy.isAllowed, reporter.delete);

  // Finish by binding the reporter middleware
  app.param('reporterId', reporter.reporterByID);
};
