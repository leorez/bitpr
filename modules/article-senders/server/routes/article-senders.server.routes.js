'use strict';

var articleSendersPolicy = require('../policies/article-senders.server.policy'),
  articleSenders = require('../controllers/article-senders.server.controller');

var multipart = require('connect-multiparty');

module.exports = function (app) {
  app.use(multipart({
    uploadDir: __dirname + '/tmp'
  }));

  app.route('/api/article-senders').all(articleSendersPolicy.isAllowed)
    .get(articleSenders.list)
    .post(articleSenders.create);

  app.route('/api/article-senders/:articleSenderId').all(articleSendersPolicy.isAllowed)
    .get(articleSenders.read)
    .put(articleSenders.update)
    .delete(articleSenders.delete);

  app.route('/api/article-senders-send')
    .post(articleSenders.sendArticle);

  app.route('/api/re-send-article')
    .post(articleSenders.reSendArticle);

  app.route('/api/send-files')
    .post(articleSenders.sendFiles);

  app.param('articleSenderId', articleSenders.articleSenderByID);
};
