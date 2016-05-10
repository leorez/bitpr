/**
 * Created by noruya on 16. 5. 10.
 */
'use strict';

describe('Given keywods and crawl schedule', function () {
  var user1 = {
    corpCode: '005930',
    firstName: 'test',
    lastName: 'user',
    email: 'test.user@meanjs.com',
    username: 'testUser',
    password: 'P@$$w0rd!!'
  };
  beforeEach(function () {
    browser.get('http://localhost:3001/authentication/signin');

    element(by.model('vm.credentials.username')).sendKeys(user1.username);
    element(by.model('vm.credentials.password')).sendKeys(user1.password);
    element(by.css('button[type=submit]')).click();
  });

  describe('', function () {
    it('should ', function () {
      browser.get('http://localhost:3001/settings/config');

      element(by.model('keywords')).sendKeys('키워드1');
      element(by.model('keywords')).sendKeys('키워드2');

    });
  });
});
