'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  async = require('async'),
  crypto = require('crypto');

var mailcomposer = require('mailcomposer');

var mailgun = require('mailgun-js')({
  apiKey: 'key-52k6ubqaqzw6ir5g75mob96cqa03-xi3',
  domain: 'bitpr.kr'
});

function sendEmail(options, callback) {
  console.log('sendEmail');
  var mail = mailcomposer({
    from: options.from || '"비트피알" <system@bitpr.kr>', // sender address
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
}

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.email) {
        User.findOne({
          email: req.body.email.toLowerCase()
        }, '-salt -password', function (err, user) {
          if (err || !user) {
            return res.status(400).send({
              message: '입력하신 이메일 주소로 가입된 사용자가 없습니다.'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: '암호 재설정이 불가합니다. 아마도 ' + user.provider + '의 계정으로 가입하신것 같습니다.'
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(400).send({
          message: '이메일을 입력해 주세요.'
        });
      }
    },
    function (token, user, done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
        name: user.displayName,
        appName: config.app.title,
        url: httpTransport + req.headers.host + '/api/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: '[비트피알] 암호를 재설정 합니다.',
        html: emailHTML
      };

      sendEmail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: '입력하신 이메일 주소로 암호재설정 이메일을 전송하였습니다.'
          });
        } else {
          return res.status(400).send({
            message: '이메일 발송에 실패하였습니다.'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (err || !user) {
      return res.redirect('/password/reset/invalid');
    }

    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  async.waterfall([

    function (done) {
      User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, user) {
        if (!err && user) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    // Remove sensitive data before return authenticated user
                    user.password = undefined;
                    user.salt = undefined;

                    res.json(user);

                    done(err, user);
                  }
                });
              }
            });
          } else {
            return res.status(400).send({
              message: '암호가 맞지 않습니다.'
            });
          }
        } else {
          return res.status(400).send({
            message: 'Password reset token is invalid or has expired.'
          });
        }
      });
    },
    function (user, done) {
      res.render('modules/users/server/templates/reset-password-confirm-email', {
        name: user.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: '[비트피알] 암호가 재설정 되었습니다.',
        html: emailHTML
      };

      sendEmail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: '암호가 변경되었습니다.'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(400).send({
                message: '암호가 맞지 않습니다.'
              });
            }
          } else {
            res.status(400).send({
              message: '현재 암호가 맞지 않습니다.'
            });
          }
        } else {
          res.status(400).send({
            message: '해당 사용자가 없습니다.'
          });
        }
      });
    } else {
      res.status(400).send({
        message: '새 암호를 입력하세요'
      });
    }
  } else {
    res.status(400).send({
      message: '로그인이 필요합니다.'
    });
  }
};
