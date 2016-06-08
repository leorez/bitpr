(function (app) {
  'use strict';

  app.registerModule('mailinglist', ['core']);
  app.registerModule('mailinglist.services');
  app.registerModule('mailinglist.routes', ['ui.router', 'core.routes', 'mailinglist.services']);
}(ApplicationConfiguration));
