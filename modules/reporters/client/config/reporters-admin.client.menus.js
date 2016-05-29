(function () {
  'use strict';

  angular
    .module('reporters.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: '기자 관리',
      state: 'admin.reporters'
    });
  }
}());
