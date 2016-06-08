(function () {
  'use strict';

  describe('Mailinglist E2E tests', function() {
    var list1 = {
      name: 'Test Name',
      email: 'noruya@gmail.com'
    };

    var group = 'TestGroup';
    var group2 = 'TestGroup2';

    describe('메일링리스트 그룹 생성 테스트', function () {
      beforeEach(function () {
        browser.get('/mailinglist/create-group');
      });

      it('그룹이름을 입력하고 생성버튼을 누르면 그룹이 추가되고 리스트에 나타나야한다.', function() {
        element(by.model('vm.mailinglistGroup.name')).sendKeys(group);
        element(by.buttonText('추가')).click();
        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            return /\/mailinglist\/group-list/.test(url);
          });
        }, 1000);
      });
    });

    describe('메일링리스트 가입테스트', function () {
      beforeEach(function () {
        browser.get('/mailinglist/create?group=' + group + '');
      });

      it('가입폼에 이름과 이메일을 입력하면 리스트에 목록이 나타나야한다.', function () {
        element(by.model('vm.mailinglist.name')).sendKeys(list1.name);
        element(by.model('vm.mailinglist.email')).sendKeys(list1.email);

        element(by.buttonText('가입')).click();
        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            expect(element(by.binding('vm.message')).getText()).toBe('이메일 주소 ' + list1.email + '로 메일링리스트에 가입되었습니다.');
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

    // describe('메일링리스트 목록 테스트', function () {
    //   beforeEach(function () {
    //     browser.get('/mailinglist');
    //   });
    //
    //   it('목록에 가입된 이메일이 있어야 한다.', function () {
    //     expect(element.all(by.repeater('item in vm.items')).count()).toBe(1);
    //   });
    // });

    describe('메일링리스트 그룹과 메일링리스트 테스트', function () {
      beforeEach(function () {
        browser.get('/mailinglist/group-list');
      });

      it('그룹을 클릭하면 소속된 메일링리스트가 나타난다.', function () {
        element.all(by.repeater('item in vm.items')).get(0).click();

        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            return /\/mailinglist\/list/.test(url);
          });
        }, 1000);
      });
    });
  });

}());

