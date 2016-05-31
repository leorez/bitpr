(function () {
  'use strict';

  angular
    .module('dashboard')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

  }
}());
