/**
 * Created by noruya on 16. 5. 4.
 */
(function () {
  'use strict';

  angular
    .module('article-senders')
    .controller('ArticleSendersListController', ArticleSendersListController);

  ArticleSendersListController.$inject = ['ArticleSendersService'];

  function ArticleSendersListController(ArticleSendersService) {
    var vm = this;

    vm.articleSenders = ArticleSendersService.query();
  }
}());
