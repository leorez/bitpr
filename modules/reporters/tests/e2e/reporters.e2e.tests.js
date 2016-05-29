(function () {
  'use strict';

  describe('Reporters E2E Tests', function () {
    var reporter1 = {
      name: 'reporter1',
      corpName: 'corpName1',
      telephone: '032-0987-6543',
      cellphone: '010-1234-5678',
      email: 'reporter1@test.com',
      priority: 0
    };

    var reporter2 = {
      name: 'reporter2',
      corpName: 'corpName2',
      telephone: '02-1234-5678',
      cellphone: '010-2133-5432',
      email: 'reporter2@test.com',
      priority: 1
    };

    var signout = function () {
      // Make sure user is signed out first
      browser.get('http://localhost:3001/authentication/signout');
      // Delete all cookies
      browser.driver.manage().deleteAllCookies();
    };

    beforeEach(function () {
      signout();

      var user1 = {
        email: 'test.user@test.com',
        password: 'P@$$w0rd!!'
      };

      browser.get('/authentication/signin');

      element(by.model('vm.credentials.email')).sendKeys(user1.email);
      element(by.model('vm.credentials.password')).sendKeys(user1.password);
      element(by.css('button[type=submit]')).click();

      return browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return /\//.test(url);
        });
      }, 1000);
    });

    describe('Given Reporters create page', function () {
      beforeEach(function () {
      });

      it('Should be able to success create reporter', function () {
        browser.get('/admin/reporters/create');

        element(by.model('vm.reporter.name')).sendKeys(reporter1.name);
        element(by.model('vm.reporter.corpName')).sendKeys(reporter1.corpName);
        element(by.model('vm.reporter.email')).sendKeys(reporter1.email);
        element(by.model('vm.reporter.telephone')).sendKeys(reporter1.telephone);
        element(by.model('vm.reporter.cellphone')).sendKeys(reporter1.cellphone);
        element(by.buttonText('등록')).click();

        return browser.wait(function() {
          return browser.getCurrentUrl().then(function (url) {
            return /\/admin\/reporters/.test(url);
          });
        }, 1000);
      });

      it('같은 이메일주소로 등록하면 에러가 발생하여햐 한다', function () {
        browser.get('/admin/reporters/create');

        element(by.model('vm.reporter.name')).sendKeys(reporter2.name);
        element(by.model('vm.reporter.corpName')).sendKeys(reporter2.corpName);
        element(by.model('vm.reporter.email')).sendKeys(reporter1.email);
        element(by.model('vm.reporter.telephone')).sendKeys(reporter2.telephone);
        element(by.model('vm.reporter.cellphone')).sendKeys(reporter2.cellphone);
        element(by.buttonText('등록')).click();

        expect(element(by.binding('vm.error')).getText()).toBe('Email already exists');
      });

      it('삭제버튼을 누르면 아이템이 삭제되어야 한다', function () {
        browser.get('/admin/reporters');
        element.all(by.css('.glyphicon-trash')).get(0).click();
        element.all(by.buttonText('예')).get(0).click();
        expect(element.all(by.repeater('reporter in vm.reporters')).count()).toBe(1);
      });
    });
  });

}());

