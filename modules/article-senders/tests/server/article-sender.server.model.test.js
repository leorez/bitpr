'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ArticleSender = mongoose.model('ArticleSender');

/**
 * Globals
 */
var user,
  articleSender;

/**
 * Unit tests
 */
describe('ArticleSender Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      articleSender = new ArticleSender({
        title: 'ArticleSender title',
        content: 'ArticleSender content',
        reserveTime: 1,
        sendCount: 1,
        fare: 500000
      });
      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return articleSender.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      articleSender.title = '';

      return articleSender.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    ArticleSender.remove().exec();
    User.remove().exec();

    done();
  });
});
