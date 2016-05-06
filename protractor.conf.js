'use strict';

// Protractor configuration
var config = {
  allScriptsTimeout: 11000,
  //seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    //'e2e/**/*.spec.js'
    'e2e/article-senders/article-senders.spec.js'
  ],

  baseUrl: 'http://localhost:3000',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  onPrepare: function() {
    browser.get('http://localhost:3000/authentication/signin');

    browser.findElement(by.id('username')).sendKeys('test2');
    browser.findElement(by.id('password')).sendKeys('testtest!09AA');
    browser.findElement(by.buttonText('로그인')).click();

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
