'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');
  var crawledArticles = require('../controllers/crawled-article.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  app.route('/api/crawled-articles/limit/:limit/page/:page')
    .get(crawledArticles.list);
  app.route('/api/crawled-articles/:crawledArticleId')
    .put(crawledArticles.update);

  app.route('/api/displayed-articles/embed/:corpCode')
    .get(crawledArticles.displays);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);

  app.param('crawledArticleId', crawledArticles.crawledArticleByID);
};
