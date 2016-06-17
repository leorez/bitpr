'use strict';

module.exports = function (app) {
  // User Routes
  var crawledArticles = require('../controllers/crawled-article.server.controller');
  var counts = require('../controllers/counts.server.controller');

  app.route('/api/crawled-articles/:limit/:page/:filter')
    .get(crawledArticles.list);

  app.route('/api/crawled-articles')
    .post(crawledArticles.create);

  app.route('/api/crawled-articles/:crawledArticleId')
    .put(crawledArticles.update);

  app.route('/api/displayed-articles/embed/:corpCode')
    .get(crawledArticles.displays);

  app.route('/api/daily-counts')
    .get(counts.dailyCounts);

  app.param('crawledArticleId', crawledArticles.crawledArticleByID);
};
