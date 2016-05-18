/**
 * Created by noruya on 16. 4. 27.
 */
'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  app = require(path.resolve('./config/lib/app')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ArticleSender = mongoose.model('ArticleSender'),
  agent = request.agent(app);


var credentials,
  user,
  articleSender;

describe('ArticleSender CRUD tests', function () {
  beforeEach(function (done) {
    credentials = {
      username: 'username',
      password: 'password'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new article
    user.save(function () {
      articleSender = {
        title: 'ArticleSender Title',
        content: 'ArticleSender Content',
        reserveTime: 1,
        beToDart: true,
        sendCount: 1,
        fare: 1
      };

      done();
    });
  });

  describe('Method save', function () {

    it('should create new articleSender if user logged in', function (done) {
      agent.post('/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) done(signinErr);

          // Get the userId
          var userId = user.id;

          agent.post('/article-senders')
            .send(articleSender)
            .expect(200)
            .end(function (articleSenderSaveErr, articleSenderSaveRes) {
              if (articleSenderSaveErr) done(articleSenderSaveErr);

              agent.get('/article-senders')
                .end(function (articleSenderGetErr, articleSenderGetRes) {
                  if (articleSenderGetErr) done(articleSenderGetErr);

                  var data = articleSenderGetRes.body;

                  (data[0].user._id).should.equal(userId);
                  (data[0].title).should.match('ArticleSender Title');
                  (data[0].content).should.match('ArticleSender Content');


                  done();
                });
            });

        });
    });

    it('should not be able to save an articleSender if not logged in', function (done) {
      agent.post('/article-senders')
        .send(articleSender)
        .expect(401)
        .end(function (articleSenderSaveErr, articleSenderSaveRes) {
          done(articleSenderSaveErr);
        });
    });

    it('should not be able to save an aarticleSender if no title is provided', function (done) {
      articleSender.title = '';
      agent.post('/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) done(signinErr);

          // Get the userId
          var userId = user.id;

          // Save a new article
          agent.post('/article-senders')
            .send(articleSender)
            .expect(400)
            .end(function (articleSaveErr, articleSaveRes) {
              // Set message assertion
              (articleSaveRes.body.message).should.match('Title cannot be blank');

              // Handle article save error
              done(articleSaveErr);
            });
        });
    });

    it('should be able to update an articleSender if signed in', function (done) {
      agent.post('/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) done(signinErr);

          // Get the userId
          var userId = user.id;

          // Save a new article
          agent.post('/article-senders')
            .send(articleSender)
            .expect(200)
            .end(function (articleSaveErr, articleSaveRes) {
              // Handle article save error
              if (articleSaveErr) done(articleSaveErr);

              // Update article title
              articleSender.title = 'WHY YOU GOTTA BE SO MEAN?';

              // Update an existing article
              agent.put('/article-senders/' + articleSaveRes.body._id)
                .send(articleSender)
                .expect(200)
                .end(function (articleUpdateErr, articleUpdateRes) {
                  // Handle article update error
                  if (articleUpdateErr) done(articleUpdateErr);

                  // Set assertions
                  (articleUpdateRes.body._id).should.equal(articleSaveRes.body._id);
                  (articleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                  // Call the assertion callback
                  done();
                });
            });
        });
    });

    it('should be able to delete an articleSender if signed in', function (done) {
      agent.post('/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          if (signinErr) done(signinErr);

          var userId = user.id;

          agent.post('/article-senders')
            .send(articleSender)
            .expect(200)
            .end(function (articleSenderSaveErr, articleSenderSaveRes) {
              if (articleSenderSaveErr) done(articleSenderSaveErr);

              agent.delete('/article-senders/' + articleSenderSaveRes.body._id)
                .send(articleSender)
                .expect(200)
                .end(function (articleSenderDeleteErr, articleSenderDeleteRes) {
                  if (articleSenderDeleteErr) done(articleSenderDeleteErr);

                  (articleSenderDeleteRes.body._id).should.equal(articleSenderSaveRes.body._id);

                  done();
                });
            });
        });
    });

    it('should not be able to delete an articleSender if not signed in', function (done) {
      articleSender.user = user;
      var articleSenderObj = new ArticleSender(articleSender);

      articleSenderObj.save(function () {
        request(app).delete('/article-senders/' + articleSenderObj._id)
          .expect(401)
          .end(function (err, res) {
            (res.body.message).should.match('User is not logged in');

            done(err);
          });
      });
    });
  });

  afterEach(function (done) {
    ArticleSender.remove().exec();
    User.remove().exec();
    done();
  });
});
