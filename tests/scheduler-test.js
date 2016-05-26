/**
 * Created by noruya on 16. 5. 12.
 */
'use strict';

require('./../modules/users/server/models/user.server.model.js');
require('./../modules/article-senders/server/models/article-sender.server.model.js');

var config = require('./../config/config'),
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
  fs.copySync(e2etestRoot + '/test1.jpeg', uploadsRoot + '/images/test1.jpeg');
  fs.copySync(e2etestRoot + '/test2.jpeg', uploadsRoot + '/images/test2.jpeg');
  fs.copySync(e2etestRoot + '/test3.jpg', uploadsRoot + '/images/test3.jpg');
  console.log('success copy files');
} catch (err) {
  console.error(err);
}

var user1 = {
  corpCode: '005930',
  corpName: '거북선',
  firstName: 'test',
  lastName: 'user',
  email: 'noruya@gmail.com',
  username: 'testUser',
  displayName: '홍길동',
  password: 'P@$$w0rd!!',
  provider: 'local',
  telephone: '02-0987-6543',
  cellphone: '010-2187-3886'
};

// 즉시발송 테스트용
var articleSender_imediate = {
  status: 'Reserved',
  title: '거북선 보도자료',
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

// 1시간후 예약발송 테스트용
// 테스트를 용이 하게 하기 위해 예약시간을 54분지난 시간으로 설정
var articleSender_1hour = {
  status: 'Reserved',
  title: '거북선 보도자료 (1시간후)',
  content: 'Test Content',
  file: 'test.docx',
  image1: 'test1.jpeg',
  image2: 'test2.jpeg',
  image3: 'test3.jpg',
  reserveTime: 1,
  reserved: dateAdder.subtract(new Date(), 54, "minute"),
  sendCount: 1,
  fare: 500000
};

// 공시후 확인
var articleSender_dart = {
  status: 'Reserved',
  title: '거북선 보도자료 (공시확인후)',
  content: 'Test Content',
  file: 'test.docx',
  image1: 'test1.jpeg',
  image2: 'test2.jpeg',
  image3: 'test3.jpg',
  reserveTime: 999,
  reserved: new Date(),
  sendCount: 1,
  fare: 500000,
  dspType: 'A'
};

mammoth.convertToHtml({ path: uploadsRoot + '/docs/test.docx' })
  .then(function (result) {
    articleSender_imediate.content = result.value;
    articleSender_1hour.content = result.value;
  }, function (err) {
    console.error('err: ' + err);
  }).done();

// "RECEIVERS" : ["01021873886", "01027439905", "01029731203"]

var onReadyDatabase = function () {
  var user = new User(user1);
  var finish = 0;
  var list = [];
  
  function doneProc() {
    if (++finish === list.length) {
      closeDB();
    }
  }

  user.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('success save user1');
      
      // list.push(articleSender_imediate);
      // list.push(articleSender_1hour);
      list.push(articleSender_dart);
      
      list.forEach(function (item) {
        item.user = user;
        var article = new ArticleSender(item);
        article.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('success save articleSender');
          }

          doneProc();

        });
      });
    }
  });
};

mongoose.connection.on('open', function(){
  db.connection.db.dropDatabase(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('dropped db:');
      onReadyDatabase();
    }
  });
});






