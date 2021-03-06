'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  mail = require(path.resolve('./lib/mail')),
  keygen = require('keygenerator'),
  uniquid = require('uniquid'),
  coreServerController = require(path.resolve('./modules/core/server/controllers/core.server.controller')),
  User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

function sendEmailAuth(req, key, user, res) {
  var link = 'http://' + req.headers.host + '/ea/' + key;
  var content = '<p>' + user.displayName + '님, </p>';
  content += '<div>아래링크를 클릭하시고 회원가입을 완료하세요.</div>';
  content += '<a href="' + link + '">' + link + '</a>';

  var options = {
    from: '"비트피알" <support@bitpr.kr>',
    to: user.email,
    subject: '[비트피알] 이메일 인증으로 회원가입을 완료하세요.',
    html: content
  };

  mail.sendEmail(options, function (err, info) {
    if (!err) {
      res.json(user);
    } else {
      res.status(400).send(err);
    }
  });
}

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  var key = keygen._();
  user.key = key;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      sendEmailAuth(req, key, user, res);
    }
  });
};

/**
 * 사용자정보
 */
exports.userInfo = function (req, res) {
  if (!req.user) {
    return res.status(400).send({
      message: '로그인이 필요합니다.'
    });
  }

  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    } else {
      user.password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  });
};

/**
 * 이메일 인증 요청
 * 인증이메일을 전송한다.
 */
exports.emailauthReq = function (req, res) {
  if (!req.user) {
    return res.status(400).send({
      message: '로그인이 필요합니다.'
    });
  }

  var user = req.user;
  user = _.extend(user, req.body);

  var key = keygen._();
  user.key = key;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      req.session.redirect_to = '/settings/profile';
      sendEmailAuth(req, key, user, res);
    }
  });
};

/**
 * 이메일 인증 완료
 * 인증이메일의 링크를 클릭하여 호출됨
 */
exports.emailauth = function (req, res) {
  var key = req.params.key;
  User.findOne({ key: key }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    } else {
      user.emailConfirmed = true;
      user.save(function (err) {
        if (err) {
          res.status(400).send(err);
          return;
        }
        res.redirect('/authentication/telephoneauth-info?telephone=' + user.telephone);
      });
    }
  });
};

function saveUser(srcUser, next) {
  User.findOne({ _id: srcUser._id }, function (err, user) {
    if (err) {
      next(err);
    } else {
      user = _.extend(user, srcUser);
      user.save(function (err) {
        if (err) {
          return next(err);
        }
        next();
      });
    }
  });
}

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  function loginUserResponse(user) {
    req.login(user, function (err) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(user);
      }
    });
  }

  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // 상장코드가 존재하면 업체정보를 dart를 통해 업데이트한다.
      if (user.corpCodeConfirmed && user.corpCode) {
        coreServerController.corpInfo(user.corpCode, function (corpInfo, error) {
          if (!error) {
            user.corpInfo = corpInfo;
            saveUser(user, function (error) {
              if (error) {
                console.error(error);
              }
              console.log('상장코드가 존재하면 업체정보를 dart를 통해 업데이트한다.');
              loginUserResponse(user);
            });

          } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            loginUserResponse(user);
          }
        });
      } else {
        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;

        loginUserResponse(user);
      }
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }

    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        if (!user.emailConfirmed || !user.corpCodeConfirmed || !user.telephoneConfirmed) {
          return res.redirect('/settings/profile?confirmed=false');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              corpCode: uniquid(),
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email || availableUsername + '@bitpr.kr',
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
