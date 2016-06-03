'use strict';

module.exports = function (app) {
  // User Routes
  var crawledArticles = require('../controllers/crawled-article.server.controller');

  app.route('/api/crawled-articles/:limit/:page')
    .get(crawledArticles.list);

  app.route('/api/crawled-articles')
    .post(crawledArticles.create);

  app.route('/api/crawled-articles/:crawledArticleId')
    .put(crawledArticles.update);

  app.route('/api/displayed-articles/embed/:corpCode')
    .get(crawledArticles.displays);

  app.param('crawledArticleId', crawledArticles.crawledArticleByID);
};
