(function () {
  'use strict';
  var should = require('should');
  var mail = require('./mail.js');
  var dstRoot = __dirname+'/../modules/article-senders/tests/e2e/';

  describe('mail tests', function () {

    it('should send mail', function (done) {

      this.timeout(10000);
      var sendMailOptions = {
        from: '"비트피알" <news@bitpr.kr>',
        to: 'noruya@gmail.com',
        subject: 'Test email',
        html: '<p>Email test content</p>',
        attachments: []
      };

      mail.attachFile(sendMailOptions, 'test.docx', dstRoot);
      mail.attachFile(sendMailOptions, 'test1.jpeg', dstRoot);
      mail.attachFile(sendMailOptions, 'test2.jpeg', dstRoot);
      mail.attachFile(sendMailOptions, 'test3.jpg', dstRoot);

      mail.sendEmail(sendMailOptions, function (err, info) {
        should(err).not.be.ok();
        done();
      });
    });
  });

}());

