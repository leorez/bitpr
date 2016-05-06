/**
 * Created by noruya on 16. 4. 28.
 */
'use strict';

describe('Edit ArticleSender tests', function() {
    var page;

    beforeEach(function() {
        page = require('./article-senders.po')
    });

    it('should able to edit', function() {

        browser.get('#!/create-article-sender');

        page.titleEl.sendKeys('test title');
        page.contentEl.sendKeys('test content');
        //page.beToDartEl.click();
        element(by.cssContainingText('option', '1시간후')).click();
        element(by.cssContainingText('option', '2개')).click();
        expect(page.fareEl.getText()).toContain('800000원');
        page.billBtnEl.click();

        browser.wait(function() {
            return browser.getCurrentUrl().then(function(url) {
                expect(element(by.binding('articleSender.title')).getText()).toContain('test title');
                expect(element(by.binding('articleSender.content')).getText()).toContain('test content');
                expect(element(by.binding('articleSender.reserveTime')).getText()).toContain('1');
                expect(element(by.binding('articleSender.sendCount')).getText()).toContain('2');

                element(by.linkText('수정')).click();
                browser.wait(function() {
                    return browser.getCurrentUrl().then(function(url) {
                        return /#!\/article-senders\/([0-9a-fA-F]{24})\/edit$/.test(url);
                    });
                }, 1000);

                return /#!\/article-senders\/([0-9a-fA-F]{24})$/.test(url);
            })
        }, 1000);
    });
});
