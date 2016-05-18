(function () {
  'use strict';

  angular
    .module('article-senders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '보도자료',
      state: 'article-senders',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'article-senders', {
      title: '보도자료 발송현황',
      state: 'article-senders.list'
    });

    menuService.addSubMenuItem('topbar', 'article-senders', {
      title: 'My 보도자료',
      state: 'article-senders.files'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'article-senders', {
      title: '보도자료발송',
      state: 'article-senders.create',
      roles: ['user']
    });
  }
}());
