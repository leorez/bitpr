(function (app) {
  'use strict';

  app.registerModule('monitoring');
  app.registerModule('monitoring.routes', ['ui.router', 'core.routes', 'users']);
}(ApplicationConfiguration));
