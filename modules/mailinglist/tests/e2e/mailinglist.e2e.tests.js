(function () {
  'use strict';

  describe('Mailinglist E2E tests', function() {
    var list1 = {
      name: 'Test Name',
      email: 'noruya@gmail.com'
    };

    describe('메일링리스트 가입테스트', function () {
      beforeEach(function () {
        browser.get('/mailinglist/create?group="TestGroup"');
      });

      it('가입폼에 이름과 이메일을 입력하면 리스트에 목록이 나타나야한다.', function () {
        element(by.model('vm.mailinglist.name')).sendKeys(list1.name);
        element(by.model('vm.mailinglist.email')).sendKeys(list1.email);

        element(by.buttonText('가입')).click();
        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            expect(element(by.binding('vm.message')).getText()).toBe(list1.email + '로 인증메일이 발송되었습니다.');
            return /\/mailinglist\/success/.test(url);
          });
        }, 1000);
      });

      // it('이름을 넣지 않으면 에러가 발생한다.', function () {
      //   element(by.model('vm.mailinglist.email')).sendKeys(list1.email);
      //
      //   element(by.buttonText('가입')).click();
      //   expect(element(by.binding('vm.error')).getText().length).not.toBe(0);
      // });
      //
      // it('이메일을 넣지 않으면 에러가 발생한다.', function () {
      //   element(by.model('vm.mailinglist.name')).sendKeys(list1.name);
      //
      //   element(by.buttonText('가입')).click();
      //   expect(element(by.binding('vm.error')).getText().length).not.toBe(0);
      // });
      //
      // it('형식에 맞지 않는 이메일을 넝으면 에러가 발생한다.', function () {
      //   element(by.model('vm.mailinglist.name')).sendKeys(list1.name);
      //   element(by.model('vm.mailinglist.email')).sendKeys('invalidemail');
      //
      //   element(by.buttonText('가입')).click();
      //   expect(element(by.binding('vm.error')).getText().length).not.toBe(0);
      // });
    });

    describe('메일링리스트 목록 테스트', function () {
      beforeEach(function () {
        browser.get('/mailinglist');
      });

      it('목록에 가입된 이메일이 있어야 한다.', function () {
        expect(element.all(by.repeater('item in vm.items')).count()).toBe(1);
      });
    });
  });

}());

