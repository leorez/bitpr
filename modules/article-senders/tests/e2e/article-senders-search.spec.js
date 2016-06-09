/**
 * Created by noruya on 16. 4. 27.
 */
'use strict';

describe('보도자료 검색 테스트', function () {
  var data1 = {
    title: 'Test Title',
    subheadline: 'Test Subheadline',
    lead: 'Test Lead',
    main: 'Test Main',
    detail: 'Test Detail',
    corpSummary: 'Test CorpSummary'
  };

  var data2 = {
    title: 'Test Title2',
    subheadline: 'Test Subheadline2',
    lead: 'Test Lead2',
    main: 'Test Main2',
    detail: 'Test Detail2',
    corpSummary: 'Test CorpSummary2'
  };

  describe('보도자료 작성', function () {
    beforeEach(function () {
      browser.get('/article-senders/create');
    });

    function clearAll() {
      element(by.model('vm.articleSender.title')).clear();
      element(by.model('vm.articleSender.subheadline')).clear();
      element(by.model('vm.articleSender.lead')).clear();
      element(by.model('vm.articleSender.main')).clear();
      element(by.model('vm.articleSender.detail')).clear();
      element(by.model('vm.articleSender.corpSummary')).clear();
    }

    it('should be able to submit with default values', function () {
      clearAll();
      element(by.model('vm.articleSender.title')).sendKeys(data1.title);
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

    it('should be able to submit with data2', function () {
      clearAll();
      element(by.model('vm.articleSender.title')).sendKeys(data2.title);
      element(by.model('vm.articleSender.subheadline')).sendKeys(data2.subheadline);
      element(by.model('vm.articleSender.lead')).sendKeys(data2.lead);
      element(by.model('vm.articleSender.main')).sendKeys(data2.main);
      element(by.model('vm.articleSender.detail')).sendKeys(data2.detail);
      element(by.model('vm.articleSender.corpSummary')).sendKeys(data2.corpSummary);
      element(by.cssContainingText('option', '즉시')).click();
      element(by.cssContainingText('option', '4개')).click();
      element(by.css('button[type="submit"]')).click();

      browser.wait(function () {
        return browser.getCurrentUrl().then(function (url) {
          return /article-senders$/.test(url);
        });
      }, 1000);
    });

  });

  /*eslint-disable*/
  describe('검색테스트', function () {
    beforeEach(function () {
      browser.get('/article-senders');
    });

    it('검색어를 입력하고 엔터를 누르면 검색결과가 나와야한다.', function () {
      element(by.model('vm.keyword')).sendKeys('Test', protractor.Key.ENTER);
      expect(element.all(by.repeater('item in vm.data.articleSenders')).count()).not.toBe(0);
    });

    it('자료에 없는 검색어를 입력하고 엔터를 누르면 검색결과가 나오지 않아야 한다.', function () {
      element(by.model('vm.keyword')).sendKeys('InvalidKeyowrd', protractor.Key.ENTER);
      expect(element.all(by.repeater('item in vm.data.articleSenders')).count()).toBe(0);
    });
  });

  describe('정렬테스트', function () {
    beforeEach(function () {
      browser.get('/article-senders');
    });

    it('최신순', function () {
      element(by.model('vm.order')).sendKeys('최신순');
      expect(element.all(by.repeater('item in vm.data.articleSenders')).first().element(by.binding('item.title')).getText()).toBe(data2.title);
      expect(element.all(by.repeater('item in vm.data.articleSenders')).last().element(by.binding('item.title')).getText()).toBe(data1.title);
    });

    it('오랜된순', function () {
      element(by.model('vm.order')).sendKeys('오래된순');
      expect(element.all(by.repeater('item in vm.data.articleSenders')).first().element(by.binding('item.title')).getText()).toBe(data1.title);
      expect(element.all(by.repeater('item in vm.data.articleSenders')).last().element(by.binding('item.title')).getText()).toBe(data2.title);
    });

    it('희망보도 갯수', function () {
      element(by.model('vm.order')).sendKeys('희망보도 갯수');
      expect(element.all(by.repeater('item in vm.data.articleSenders')).first().element(by.binding('item.title')).getText()).toBe(data2.title);
      expect(element.all(by.repeater('item in vm.data.articleSenders')).last().element(by.binding('item.title')).getText()).toBe(data1.title);
    });
  });
  /*eslint-disable*/
});
