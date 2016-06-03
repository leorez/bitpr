(function (app) {
  'use strict';

  app.registerModule('monitoring');
  app.registerModule('monitoring.routes', ['ui.router', 'core.routes', 'users', 'monitoring.services']);
  app.registerModule('monitoring.services');
}(ApplicationConfiguration));
