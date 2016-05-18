'use strict';

// Protractor configuration
var config = {
  allScriptsTimeout: 11000,
  //seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    // 'e2e/**/*.spec.js'
    // 'modules/article-senders/tests/e2e/article-senders.spec.js',
    'modules/article-senders/tests/e2e/files-article-sender.spec.js'
    // 'modules/users/tests/e2e/*.js'
    // 'modules/users/tests/e2e/*.tests.js'
  ],

  baseUrl: 'http://localhost:3001',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  onPrepare: function() {
    var user1 = {
      email: 'test.user@test.com',
      password: 'P@$$w0rd!!'
    };

    browser.get('/authentication/signin');

    element(by.model('vm.credentials.email')).sendKeys(user1.email);
    element(by.model('vm.credentials.password')).sendKeys(user1.password);
    element(by.css('button[type=submit]')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    return browser.wait(function() {
      return browser.getCurrentUrl().then(function(url) {
        return /\//.test(url);
      });
    }, 1000);
  }
};


if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 2
  };
}



exports.config = config;
