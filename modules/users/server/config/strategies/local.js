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
    usernameField: 'email',
    passwordField: 'password'
  },
  function (username, password, done) {
    console.log('username: ' + username);
    console.log('password: ' + password);
    User.findOne({
      email: username.toLowerCase()
    }, function (err, user) {
      if (err) {
        return done(err);
      }
      console.log('user: ' + user);
      if (user && !user.emailConfirmed) {
        return done(null, false, {
          message: '이메일 인증이 필요합니다.'
        });
      }
      else if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: '이메일 또는 암호가 잘못입력되었습니다.'
        });
      }

      return done(null, user);
    });
  }));
};
