(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
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
      title: '환경설정',
      state: 'settings.config'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '수집된 기사목록',
      state: 'settings.crawled-list'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '홈페이지에 게시된 기사목록',
      state: 'settings.displayed-list'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '내정보',
      state: 'settings.profile'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '사진',
      state: 'settings.picture'
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: '암호변경',
      state: 'settings.password'
    });

    // menuService.addSubMenuItem('account', 'settings', {
    //   title: 'Manage Social Ac경counts',
    //   state: 'settings.accounts'
    // });
  }
}());
