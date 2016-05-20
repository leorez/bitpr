(function () {
  'use strict';
  var mailcomposer = require('mailcomposer');
  var mailgun = require('mailgun-js')({
    apiKey: 'key-52k6ubqaqzw6ir5g75mob96cqa03-xi3',
    domain: 'bitpr.kr'
  });

  exports.sendEmail = function(options, callback) {
    /**
     * var options = {
     *  from: 발신자
     *  to: 수신자 이메일 리스트 array
     *  subject: 제목
     *  html: 내용(html)
     *  attachments: 첨부파일
     * };
     */
    console.log('sendEmail');
    var mail = mailcomposer({
      from: options.from || '"비트피알" <support@bitpr.kr>', // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      html: options.html, // plaintext body
      attachments: options.attachments
    });

    mail.build(function (mailBuildError, message) {
      if (mailBuildError) {
        console.error(mailBuildError);
        callback(mailBuildError, message);
        return;
      }

      var dataToSend = {
        to: options.to,
        message: message.toString('ascii')
      };

      console.log(message);

      mailgun.messages().sendMime(dataToSend, function (error, body) {
        console.log(body);
        console.log(error);
        callback(error, body);
      });
    });
  };

  exports.attachFile = function(options, filename, root) {
    if (typeof filename !== 'undefined' && filename.length > 0) {
      options.attachments.push({ filename: filename, path: root + filename });
    }
  };

}());

