/**
 * Created by noruya on 16. 4. 27.
 */

var ArticleSendersPage = function () {
  this.titleEl = element(by.model('vm.articleSender.title'));
  this.contentEl = element(by.model('vm.articleSender.content'));
  this.fileEl = element(by.model('vm.articleSender.file'));
  this.reserveTimeEl = element.all(by.options('t as t+\'시간후\' for t in vm.articleSender.reserveTimes'));
  this.beToDartEl = element(by.model('vm.articleSender.beToDart'));
  this.sendCountEl = element.all(by.options('c as c+\'개\' for c in vm.articleSender.sendCounts'));
  this.fareEl = element(by.binding('vm.articleSender.fare'));
  this.errorEl = element(by.binding('error'));
  this.useContentEl = element(by.css('[value="inputContent"]'));
  this.useFileUploadEl = element(by.css('[value="uploadFile"]'));
};

module.exports = new ArticleSendersPage();
