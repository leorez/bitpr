(function () {
  'use strict';

  angular
    .module('article-senders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '대시보드',
      state: 'dashboard',
      roles: ['user', 'admin']
    });

    menuService.addMenuItem('topbar', {
      title: '보도자료',
      state: 'article-senders.list',
      roles: ['user', 'admin']
    });

    menuService.addMenuItem('topbar', {
      title: '기사모니터링',
      state: 'monitoring',
      roles: ['user', 'admin']
    });
  }
}());
