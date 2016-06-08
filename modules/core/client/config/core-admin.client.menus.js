(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });

    menuService.addSubMenuItem('topbar', 'admin', {
      title: '메일링리스트',
      state: 'mailinglist.group-list'
    });
  }
}());
