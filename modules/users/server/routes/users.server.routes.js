'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');
  var crawledArticles = require('../controllers/crawled-article.server.controller');
  var displayedArticles = require('../controllers/displayed-article.server.controller');

  // Setting up the users profile api
  app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);
  app.route('/api/crawled-articles').get(crawledArticles.list);
  app.route('/api/displayed-articles')
    .get(displayedArticles.list)
    .post(displayedArticles.create);

  app.route('/api/displayed-articles/:corpCode')
    .get(displayedArticles.list);

  app.route('/api/displayed-articles/:displayedArticleId')
    .delete(displayedArticles.delete);

  app.param('displayedArticleId', displayedArticles.displayedArticleByID);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
