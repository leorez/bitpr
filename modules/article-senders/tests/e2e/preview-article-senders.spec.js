/**
 * Created by noruya on 16. 4. 28.
 */
'usr strict';

describe('Preview ArticleSenders tests', function () {
  var page;

  beforeEach(function () {
    page = require('./article-senders.po.js');
  });

  it('should able to see all elements', function () {
    browser.get('#!/create-article-sender');

    page.titleEl.sendKeys('test title');
    page.contentEl.sendKeys('test content');
    element(by.cssContainingText('option', '1시간후')).click();
    element(by.cssContainingText('option', '2개')).click();
    expect(page.fareEl.getText()).toContain('800000원');
    page.billBtnEl.click();

    browser.wait(function () {
      return browser.getCurrentUrl().then(function (url) {
        expect(element(by.binding('articleSender.title')).getText()).toContain('test title');
        expect(element(by.binding('articleSender.content')).getText()).toContain('test content');
        expect(element(by.binding('articleSender.reserveTime')).getText()).toContain('1');
        expect(element(by.binding('articleSender.sendCount')).getText()).toContain('2');
        return /#!\/article-senders\/([0-9a-fA-F]{24})$/.test(url);
      });
    }, 1000);

  });
});
