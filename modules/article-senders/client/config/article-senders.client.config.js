(function () {
  'use strict';

  angular
    .module('article-senders')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    
  }
}());
