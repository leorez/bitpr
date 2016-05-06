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

  app.route('/api/article-senders-send').all(articleSendersPolicy.isAllowed)
    .post(articleSenders.send);

  app.param('articleSenderId', articleSenders.articleSenderByID);
};
