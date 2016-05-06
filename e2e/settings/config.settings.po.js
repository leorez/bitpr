/**
 * Created by noruya on 16. 4. 22.
 */
'use strict';

var ConfigSettingsPage = function() {
    this.keywordsEl = element(by.model('keywords'));
    this.saveConfigBtnEl = element(by.id('saveConfigBtn'));
};

module.exports = new ConfigSettingsPage();
