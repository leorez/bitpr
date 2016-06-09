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
  /*eslint-disable*/

});
