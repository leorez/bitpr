(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService', 'Authentication'];

  function menuConfig(menuService, Authentication) {

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
      state: 'monitoring.list',
      roles: ['user', 'admin']
    });

    menuService.addMenu('account', {
      roles: ['user']
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '키워드편집',
      state: 'settings.config'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '내정보',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '사진',
      state: 'settings.picture'
    });

    if (Authentication.user.provider === 'local') {
      menuService.addSubMenuItem('account', 'settings', {
        title: '암호변경',
        state: 'settings.password'
      });
    }

    // menuService.addSubMenuItem('account', 'settings', {
    //   title: 'Manage Social Ac경counts',
    //   state: 'settings.accounts'
    // });
  }
}());
