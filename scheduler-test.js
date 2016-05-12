/**
 * Created by noruya on 16. 5. 12.
 */
'use strict';

require('./modules/users/server/models/user.server.model');
require('./modules/article-senders/server/models/article-sender.server.model');

var config = require('./config/config'),
  chalk = require('chalk'),
  process = require('process'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ArticleSender = mongoose.model('ArticleSender'),
  DateDiff = require('date-diff'),
  fs = require('fs-extra'),
  mammoth = require('mammoth'),
  dateAdder = require('add-subtract-date');

require('date-format-lite');

console.log(process.env.NODE_ENV);
config.db.url = 'mongodb://localhost/bitpr-test';

console.log(config.db.url);

var db = mongoose.connect(config.db.url, function (err) {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  }
});

function closeDB() {
  db.connection.db.close(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('closed db');
    }
  });
}

var e2etestRoot = __dirname + '/modules/article-senders/tests/e2e';
console.log(e2etestRoot);
var uploadsRoot = __dirname+'/uploads';
console.log(uploadsRoot);

try {
  fs.copySync(e2etestRoot + '/test.docx', uploadsRoot + '/docs/test.docx');
  fs.copySync(e2etestRoot + '/test1.jpeg', uploadsRoot + '/docs/test1.jpeg');
  fs.copySync(e2etestRoot + '/test2.jpeg', uploadsRoot + '/docs/test2.jpeg');
  fs.copySync(e2etestRoot + '/test3.jpg', uploadsRoot + '/docs/test3.jpg');
  console.log('success copy files');
} catch (err) {
  console.error(err);
}

var user1 = {
  corpCode: '005930',
  firstName: 'test',
  lastName: 'user',
  email: 'noruya@gmail.com',
  username: 'testUser',
  displayName: 'test user',
  password: 'P@$$w0rd!!',
  provider: 'local',
  cellphone: '010-2187-3886'
};

var fiveMinLeft = dateAdder.subtract(new Date(), 55, "minute");
// 즉시발송 테스트용
var articleSender_imediate = {
  status: 'Reserved',
  title: 'Test Title',
  content: 'Test Content',
  file: 'test.docx',
  image1: 'test1.jpeg',
  image2: 'test2.jpeg',
  image3: 'test3.jpg',
  reserveTime: 0,
  reserved: new Date(),
  sendCount: 1,
  fare: 500000
};

mammoth.convertToHtml({ path: uploadsRoot + '/docs/test.docx' })
  .then(function (result) {
    articleSender_imediate.content = result.value;
  }, function (err) {
    console.error('err: ' + err);
  }).done();

// "RECEIVERS" : ["01021873886", "01027439905", "01029731203"]

mongoose.connection.on('open', function(){
  db.connection.db.dropDatabase(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('dropped db:');
    }
  });

  var user = new User(user1);
  user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('success save user1');
      articleSender_imediate.user = user;
      var article = new ArticleSender(articleSender_imediate);

      article.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('success save articleSender_imediate');
        }

        closeDB();
      });
    }
  });

});







