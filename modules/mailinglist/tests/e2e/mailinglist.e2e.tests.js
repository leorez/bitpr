(function () {
  'use strict';

  describe('Mailinglist E2E tests', function () {
    var list1 = {
      name: 'Test Name',
      email: 'noruya@gmail.com'
    };

    var list2 = {
      name: 'Test Name2',
      email: 'test2@gmail.com'
    };

    var group = 'TestGroup';
    var group2 = 'TestGroup2';

    describe('메일링리스트 그룹 생성 테스트', function () {
      beforeEach(function () {
        browser.get('/mailinglist/create-group');
      });

      it('그룹이름을 입력하고 생성버튼을 누르면 그룹이 추가되고 리스트에 나타나야한다.', function () {
        element(by.model('vm.mailinglistGroup.name')).sendKeys(group);
        element(by.buttonText('추가')).click();
        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            return /\/mailinglist\/group-list/.test(url);
          });
        }, 1000);
      });

      it('그룹이름을 입력하고 생성버튼을 누르면 group2가 추가되고 리스트에 나타나야한다.', function () {
        element(by.model('vm.mailinglistGroup.name')).sendKeys(group2);
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

      it('list2 가입테스트', function () {
        element(by.model('vm.mailinglist.name')).sendKeys(list2.name);
        element(by.model('vm.mailinglist.email')).sendKeys(list2.email);

        element(by.buttonText('가입')).click();
        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            expect(element(by.binding('vm.message')).getText()).toBe('이메일 주소 ' + list2.email + '로 메일링리스트에 가입되었습니다.');
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

    describe('메일링리스트 삭제 테스트', function () {
      beforeEach(function () {
        browser.get('/mailinglist/group-list');
        element.all(by.css('.list-group-item-heading')).get(1).click();

        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            return /\/mailinglist\/list/.test(url);
          });
        }, 1000);
      });

      it('첫번째 아이템을 선택하고 삭제버튼을 누르면 아이템이 줄어들어야한다.', function () {
        element.all(by.css('.checkbox')).get(0).click();
        element(by.css('.glyphicon-trash')).click();
        browser.switchTo().alert().then(function () {
          browser.switchTo().alert().accept();
          browser.switchTo().defaultContent();
          expect(element.all(by.repeater('item in vm.items')).count()).toBe(1);
        });
      });
    });

    describe('메일링리스트 그룹과 메일링리스트 테스트', function () {
      beforeEach(function () {
        browser.get('/mailinglist/group-list');
      });

      it('추가버튼을 누르면 그룹생성 화면이 나타나야한다.', function () {
        element(by.buttonText('추가')).click();
        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            return /\/mailinglist\/create-group/.test(url);
          });
        }, 1000);
      });

      it('그룹을 클릭하면 소속된 메일링리스트가 나타난다.', function () {
        expect(element.all(by.binding('item.count')).get(0).getText()).toBe('0');
        expect(element.all(by.binding('item.count')).get(1).getText()).toBe('1');
      });

      it('그룹을 클릭하면 소속된 메일링리스트가 나타난다.', function () {
        element.all(by.css('.list-group-item-heading')).get(1).click();

        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            return /\/mailinglist\/list/.test(url);
          });
        }, 1000);
      });

      it('그룹을 선택하고 삭제버튼을 누르면 삭제가 완료되어야 한다.', function () {
        expect(element.all(by.repeater('item in vm.items')).count()).toBe(2);

        element.all(by.css('.checkbox')).get(0).click();
        element.all(by.css('.checkbox')).get(1).click();
        element(by.css('.glyphicon-trash')).click();

        browser.switchTo().alert().then(function () {
          browser.switchTo().alert().accept();
          browser.switchTo().defaultContent();
          expect(element.all(by.repeater('item in vm.items')).count()).toBe(0);
        });
      });
    });

  });

}());

