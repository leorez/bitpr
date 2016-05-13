/**
 * Created by noruya on 16. 4. 27.
 */
'use strict';

describe('articleSender page tests', function () {
  var page;

  beforeEach(function () {
    browser.get('/article-senders/create');
    page = require('./article-senders.po.js');
  });

  // it('should contains correct reserveTimes', function () {
  //   expect(element(by.cssContainingText('option', '즉시')).isPresent()).toBeTruthy();
  //   expect(element(by.cssContainingText('option', '1시간후')).isPresent()).toBeTruthy();
  //   expect(element(by.cssContainingText('option', '2시간후')).isPresent()).toBeTruthy();
  //   expect(element(by.cssContainingText('option', '23시간후')).isPresent()).toBeTruthy();
  //   expect(element(by.cssContainingText('option', '24시간후')).isPresent()).toBeFalsy();
  //   expect(element(by.cssContainingText('option', '1일후')).isPresent()).toBeTruthy();
  //   expect(element(by.cssContainingText('option', '3일후')).isPresent()).toBeTruthy();
  //   expect(element(by.cssContainingText('option', '4일후')).isPresent()).toBeFalsy();
  //   expect(element(by.cssContainingText('option', '공시확인후')).isPresent()).toBeTruthy();
  // });
  //
  // it('should go index page when click cancel button', function () {
  //   element(by.css('button[type="reset"]')).click();
  //   element(by.buttonText('예')).click();
  //
  //   browser.wait(function () {
  //     return browser.getCurrentUrl().then(function (url) {
  //       return /\//.test(url);
  //     });
  //   }, 1000);
  // });

  // it('should match with fare policy', function () {
  //   element(by.cssContainingText('option', '2개')).click();
  //   expect(page.fareEl.getText()).toContain('800000원');
  //
  //   element(by.cssContainingText('option', '4개')).click();
  //   expect(page.fareEl.getText()).toContain('1100000원');
  //
  //   element(by.cssContainingText('option', '6개')).click();
  //   expect(page.fareEl.getText()).toContain('1400000원');
  //
  //   element(by.cssContainingText('option', '8개')).click();
  //   expect(page.fareEl.getText()).toContain('1700000원');
  //
  //   element(by.cssContainingText('option', '10개')).click();
  //   expect(page.fareEl.getText()).toContain('2000000원');
  //
  //   element(by.cssContainingText('option', '1개')).click();
  //   expect(page.fareEl.getText()).toContain('500000원');
  // });
  //
  // it('should be able to submit with default values', function () {
  //   page.fileEl.sendKeys(__dirname + '/test.docx');
  //   page.useContentEl.click();
  //   page.titleEl.sendKeys('test');
  //   page.contentEl.sendKeys('test content');
  //   element(by.cssContainingText('option', '0시간후')).click();
  //   element(by.cssContainingText('option', '2개')).click();
  //   expect(page.fareEl.getText()).toContain('800000원');
  //   element(by.css('button[type="submit"]')).click();
  //
  //   browser.wait(function () {
  //     return browser.getCurrentUrl().then(function (url) {
  //       return /article-senders\/([0-9a-fA-F]{24})$/.test(url);
  //     });
  //   }, 1000);
  // });
  //
  // it('should be able to submit with default values', function () {
  //   page.fileEl.sendKeys(__dirname + '/test.docx');
  //   page.useContentEl.click();
  //   page.titleEl.sendKeys('test');
  //   page.contentEl.sendKeys('test content');
  //   element(by.cssContainingText('option', '0시간후')).click();
  //   element(by.cssContainingText('option', '2개')).click();
  //   expect(page.fareEl.getText()).toContain('800000원');
  //   element(by.css('button[type="submit"]')).click();
  //
  //   browser.wait(function () {
  //     return browser.getCurrentUrl().then(function (url) {
  //       return /article-senders\/([0-9a-fA-F]{24})$/.test(url);
  //     });
  //   }, 1000);
  // });
  //
  it('should be able to display title with template', function () {
    expect(element(by.model('vm.articleSender.title')).isPresent()).toBeTruthy();
    expect(element(by.model('vm.articleSender.title')).getAttribute('value')).toEqual('삼성전자 보도자료');
  });

  it('should have 3 image file selectors', function () {
    expect(element(by.css('#image1')).isPresent()).toBeTruthy();
    expect(element(by.css('#image2')).isPresent()).toBeTruthy();
    expect(element(by.css('#image3')).isPresent()).toBeTruthy();
  });

  it('should be able to submit with docx file and images', function () {
    page.titleEl.sendKeys('test');
    page.fileEl.sendKeys(__dirname + '/test.docx');
    element(by.model('vm.articleSender.image1')).sendKeys(__dirname + '/test1.jpeg');
    element(by.model('vm.articleSender.image2')).sendKeys(__dirname + '/test2.jpeg');
    element(by.cssContainingText('option', '즉시')).click();
    element(by.cssContainingText('option', '2개')).click();
    expect(page.fareEl.getText()).toContain('800000원');
    element(by.css('button[type="submit"]')).click();
    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        var isPrevewPage = /article-senders\/([0-9a-fA-F]{24})$/.test(url);
        expect(isPrevewPage).toBeTruthy();
        if (isPrevewPage) {
          expect(element(by.css('#image1')).isPresent()).toBeTruthy();
          expect(element(by.css('#image2')).isPresent()).toBeTruthy();
          // expect(element(by.css('#image3')).isPresent()).toBeFalsy();
          return true;
        } else {
          return false;
        }
      });
    }, 10000);
  });

  // it('should be able to submit with docx file and no images', function () {
  //   page.titleEl.sendKeys('test');
  //   page.fileEl.sendKeys(__dirname + '/test.docx');
  //   element(by.cssContainingText('option', '1시간후')).click();
  //   element(by.cssContainingText('option', '2개')).click();
  //   expect(page.fareEl.getText()).toContain('800000원');
  //   element(by.css('button[type="submit"]')).click();
  //   browser.wait(function () {
  //     return browser.getCurrentUrl().then(function (url) {
  //       return /article-senders\/([0-9a-fA-F]{24})$/.test(url);
  //     });
  //   }, 1000);
  // });
  //
  // it('should cannot be able to submit with not docx file', function () {
  //   page.useFileUploadEl.click();
  //   page.titleEl.sendKeys('test');
  //   page.fileEl.sendKeys(__dirname + '/test.txt');
  //   element(by.cssContainingText('option', '1시간후')).click();
  //   element(by.cssContainingText('option', '2개')).click();
  //   expect(page.fareEl.getText()).toContain('800000원');
  //   element(by.css('button[type="submit"]')).click();
  //
  //   browser.sleep(500);
  //
  //   expect(page.errorEl.getText()).toContain("'MS Word'가 아닙니다. 파일을 확인해주세요.");
  // });
});
