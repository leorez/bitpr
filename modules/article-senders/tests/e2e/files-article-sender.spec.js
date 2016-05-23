(function () {
  'use strict';

  describe('ArticleSenders files page tests', function () {
    function createArticleSender(callback) {
      browser.get('/article-senders/create');

      element(by.model('vm.articleSender.title')).sendKeys('test');
      element(by.model('vm.articleSender.file')).sendKeys(__dirname + '/test.docx');
      element(by.model('vm.articleSender.image1')).sendKeys(__dirname + '/test1.jpeg');
      element(by.model('vm.articleSender.image2')).sendKeys(__dirname + '/test2.jpeg');
      element(by.model('vm.articleSender.image3')).sendKeys(__dirname + '/test3.jpg');
      element(by.cssContainingText('option', '즉시')).click();
      element(by.cssContainingText('option', '2개')).click();
      expect(element(by.binding('vm.articleSender.fare')).getText()).toContain('800000원');
      element(by.css('button[type="submit"]')).click();
      browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          var isPrevewPage = /article-senders\/([0-9a-fA-F]{24})$/.test(url);
          expect(isPrevewPage).toBeTruthy();
          if (isPrevewPage) {
            expect(element(by.css('#image1')).isPresent()).toBeTruthy();
            expect(element(by.css('#image2')).isPresent()).toBeTruthy();
            // expect(element(by.css('#image3')).isPresent()).toBeFalsy();
            element(by.buttonText('발송')).click();
            element(by.buttonText('닫기')).click();

            callback();
            return true;
          } else {
            return false;
          }
        });
      }, 10000);
    }

    beforeEach(function () {
    });

    describe('Before test, create articleSender', function() {
      it('', function () {
        createArticleSender(function () {
          browser.get('/article-senders/files');
          expect(element.all(by.repeater('item in vm.articleSenders')).count()).not.toBe(0);
        });
      });
    });

    describe('Given files page', function () {
      beforeEach(function() {
        browser.get('/article-senders/files');
      });

      it('Should display files', function () {
        expect(element(by.binding('item.file')).getText()).toMatch(/[a-zA-Z0-9_-].docx/);
      });

      describe('When select files and click "선택된 보도자료 재전송"', function () {
        beforeEach(function () {
          element.all(by.id('article-checkbox')).get(0).click();
          element(by.buttonText('선택된 보도자료 재전송')).click();
        });

        it('Should able to see success message', function () {
          // element.all(by.id('reporter-checkbox')).get(0).click();
          // element.all(by.id('reporter-checkbox')).get(1).click();
          element(by.id('submit')).click();
          expect(element.all(by.css('.text-success')).get(0).getText()).toBe('메일이 전송되었습니다.');
        });
      });

      // describe('When select files and click "선택된 파일 공유"', function () {
      //   beforeEach(function () {
      //     element.all(by.id('file-checkbox')).get(0).click();
      //     element.all(by.id('file-checkbox')).get(1).click();
      //     element(by.buttonText('선택된 파일 공유')).click();
      //     element(by.model('newEmail')).sendKeys('noruya@gmail.com');
      //     element(by.buttonText('+')).click();
      //   });
      //
      //   it('Should able to add email', function () {
      //     expect(element.all(by.binding('email')).get(0).getText()).toBe('noruya@gmail.com');
      //   });
      //
      //   it('Should able to delete email', function () {
      //     element.all(by.buttonText('-')).get(0).click();
      //     expect(element(by.binding('email')).isPresent()).toBe(false);
      //   });
      //
      //   it('Should able to see failed message when there is empty email list', function () {
      //     element.all(by.buttonText('-')).get(0).click();
      //     element(by.id('submit')).click();
      //     expect(element.all(by.css('.text-danger')).get(0).getText()).not.toBe('');
      //   });
      //
      //   it('Should able to see success message', function () {
      //     element(by.id('submit')).click();
      //     expect(element.all(by.css('.text-success')).get(0).getText()).toBe('메일이 전송되었습니다.');
      //   });
      // });
      //
      // describe('When click button 홈페이지에 올리기', function () {
      //   it('Should able to see button 홈페이지에서 내리기', function () {
      //     var button = element.all(by.buttonText('홈페이지에 올리기')).get(0);
      //     expect(button.isPresent()).toBe(true);
      //     element.all(by.buttonText('홈페이지에 올리기')).get(0).click();
      //     expect(element.all(by.buttonText('홈페이지에서 내리기')).get(0).isPresent()).toBe(true);
      //     element.all(by.buttonText('홈페이지에서 내리기')).get(0).click();
      //     expect(element.all(by.buttonText('홈페이지에 올리기')).get(0).isPresent()).toBe(true);
      //   });
      //
      // });

    });
  });
}());

