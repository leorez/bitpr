'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password'
  },
  function (username, password, done) {
    User.findOne({
      $or: [
        { email: username.toLowerCase() },
        { corpCode: username.toLowerCase() }
      ]
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: '이메일이나 상장코드 또는 암호가 잘못입력되었습니다.'
        });
      }

      return done(null, user);
    });
  }));
};
