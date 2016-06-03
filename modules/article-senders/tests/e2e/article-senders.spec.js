/**
 * Created by noruya on 16. 4. 27.
 */
'use strict';

describe('articleSender page tests', function () {
  var page;
  var data1 = {
    title: 'Test Title',
    subheadline: 'Test Subheadline',
    lead: 'Test Lead',
    main: 'Test Main',
    detail: 'Test Detail',
    corpSummary: 'Test CorpSummary'
  };

  beforeEach(function () {
    browser.get('/article-senders/create');
    page = require('./article-senders.po.js');
  });

  describe('보도자료 작성 테스트', function () {
    beforeEach(function () {
      browser.get('/article-senders/create');
    });

    it('should contains correct reserveTimes', function () {
      expect(element(by.cssContainingText('option', '즉시')).isPresent()).toBeTruthy();
      expect(element(by.cssContainingText('option', '1시간후')).isPresent()).toBeTruthy();
      expect(element(by.cssContainingText('option', '2시간후')).isPresent()).toBeTruthy();
      expect(element(by.cssContainingText('option', '23시간후')).isPresent()).toBeTruthy();
      expect(element(by.cssContainingText('option', '24시간후')).isPresent()).toBeFalsy();
      expect(element(by.cssContainingText('option', '1일후')).isPresent()).toBeTruthy();
      expect(element(by.cssContainingText('option', '3일후')).isPresent()).toBeTruthy();
      expect(element(by.cssContainingText('option', '4일후')).isPresent()).toBeFalsy();
      expect(element(by.cssContainingText('option', '공시확인후')).isPresent()).toBeTruthy();
    });

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

    function clearAll() {
      page.titleEl.clear();
      element(by.model('vm.articleSender.subheadline')).clear();
      element(by.model('vm.articleSender.lead')).clear();
      element(by.model('vm.articleSender.main')).clear();
      element(by.model('vm.articleSender.detail')).clear();
      element(by.model('vm.articleSender.corpSummary')).clear();
    }

    it('should be able to submit with default values', function () {
      clearAll();
      page.titleEl.sendKeys(data1.title);
      element(by.model('vm.articleSender.subheadline')).sendKeys(data1.subheadline);
      element(by.model('vm.articleSender.lead')).sendKeys(data1.lead);
      element(by.model('vm.articleSender.main')).sendKeys(data1.main);
      element(by.model('vm.articleSender.detail')).sendKeys(data1.detail);
      element(by.model('vm.articleSender.corpSummary')).sendKeys(data1.corpSummary);
      element(by.cssContainingText('option', '즉시')).click();
      element(by.cssContainingText('option', '2개')).click();
      element(by.css('button[type="submit"]')).click();

      browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return /article-senders$/.test(url);
        });
      }, 1000);
    });

    it('should be able to success temporary save', function () {
      clearAll();
      page.titleEl.sendKeys(data1.title);
      element(by.model('vm.articleSender.subheadline')).sendKeys(data1.subheadline);
      element(by.model('vm.articleSender.lead')).sendKeys(data1.lead);
      element(by.model('vm.articleSender.main')).sendKeys(data1.main);
      element(by.model('vm.articleSender.detail')).sendKeys(data1.detail);
      element(by.model('vm.articleSender.corpSummary')).sendKeys(data1.corpSummary);
      element(by.cssContainingText('option', '즉시')).click();
      element(by.cssContainingText('option', '4개')).click();
      element(by.buttonText('임시저장')).click();

      browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return /article-senders$/.test(url);
        });
      }, 1000);
    });

    it('클리어 버튼을 클릭하면 해당필드내용이 삭제되어야한다.', function () {
      element.all(by.css('.clearer')).get(0).click();
      expect(element(by.model('vm.articleSender.title')).getText()).toBe('');
      element.all(by.css('.clearer')).get(1).click();
      expect(element(by.model('vm.articleSender.subheadline')).getText()).toBe('');
      element.all(by.css('.clearer')).get(2).click();
      expect(element(by.model('vm.articleSender.lead')).getText()).toBe('');
      element.all(by.css('.clearer')).get(3).click();
      expect(element(by.model('vm.articleSender.main')).getText()).toBe('');
      element.all(by.css('.clearer')).get(4).click();
      expect(element(by.model('vm.articleSender.detail')).getText()).toBe('');
      element.all(by.css('.clearer')).get(5).click();
      expect(element(by.model('vm.articleSender.corpSummary')).getText()).toBe('');
    });

    it('이미지를 첨부하면 즉시 화면에 나타나야한다.', function () {
      element(by.id('imageFile')).sendKeys(__dirname + '/test1.jpeg');
      expect(element.all(by.repeater('image in vm.imageQueue')).get(0).isPresent()).toBe(true);
    });

  });

  describe('보도자료 목록 테스트', function () {
    beforeEach(function () {
      browser.get('/article-senders');
    });

    describe('수정 테스트', function () {
      beforeEach(function () {
        var els = element.all(by.repeater('item in vm.data.articleSenders')).first().all(by.css('.btn-link'));
        expect(els.count()).toBe(4);
        els.get(2).click();
        console.log(browser.getCurrentUrl());
        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            return /article-senders\/([0-9a-fA-F]{24})\/edit$/.test(url);
          });
        }, 1000);
      });

      it('제목을 수정하고 수정버튼을 누르면 뷰페이지에서 제목이 변경되어야 한다.', function () {
        var title = '수정된 테스트 제목';
        element(by.model('vm.articleSender.title')).clear();
        element(by.model('vm.articleSender.title')).sendKeys(title);
        element(by.buttonText('수정')).click();
        browser.wait(function () {
          return browser.getCurrentUrl().then(function (url) {
            expect(element(by.model('vm.articleSender.title')).getText()).toBe(title);
            return /article-senders\/([0-9a-fA-F]{24})$/.test(url);
          });
        }, 1000);
      });
    });
  });
});
