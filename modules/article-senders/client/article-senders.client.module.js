(function (app) {
  'use strict';

  app.registerModule('article-senders', ['core']);
  app.registerModule('article-senders.services');
  app.registerModule('article-senders.routes', ['ui.router', 'core.routes', 'article-senders.services']);
}(ApplicationConfiguration));
