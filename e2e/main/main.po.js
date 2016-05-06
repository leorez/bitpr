/**
 * Created by noruya on 16. 4. 19.
 */
'use strict';

var MainPage = function() {
    this.searchEl = element(by.model('searchKeyword'));
    this.goSearchButtonEl = element(by.id('goSearchBtn'));
};

module.exports = new MainPage();
