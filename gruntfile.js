'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  defaultAssets = require('./config/assets/default'),
  testAssets = require('./config/assets/test'),
  testConfig = require('./config/env/test'),
  fs = require('fs'),
  path = require('path');

module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    watch: {
      serverViews: {
        files: defaultAssets.server.views,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS),
        tasks: ['eslint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: defaultAssets.client.views,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      },
      clientJS: {
        files: defaultAssets.client.js,
        tasks: ['eslint'],
        options: {
          livereload: true
        }
      },
      serverTests: {
        files: testAssets.tests.server,
        tasks: ['test:server'],
        options: {
          livereload: true
        }
      },
      clientE2eTests: {
        files: testAssets.tests.e2e,
        options: {
          livereload: true
        }
      },
      clientTests: {
        files: testAssets.tests.client,
        tasks: ['test:client'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: defaultAssets.client.css,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      },
      clientSCSS: {
        files: defaultAssets.client.sass,
        // tasks: ['sass', 'csslint'],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      clientLESS: {
        files: defaultAssets.client.less,
        // tasks: ['less', 'csslint'],
        tasks: ['less'],
        options: {
          livereload: true
        }
      },
      schedulerTest: {
        files: ['scheduler.js', './tests/scheduler-test.js'],
        tasks: ['test:scheduler']
      },
      dartTest: {
        files: ['./lib/dart.js', './tests/dart.spec.js'],
        tasks: ['test:dart']
      },
      mailTest: {
        files: ['./lib/mail.js', './tests/mail.spec.js'],
        tasks: ['test:mail']
      },
      smsTest: {
        files: ['./lib/cafe24.sms.js', './tests/cafe24.sms.spec.js'],
        tasks: ['test:sms']
      },
      articleCounterTest: {
        files: ['./lib/article.counter.js', './tests/article.counter.spec.js'],
        tasks: ['test:articleCounter']
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
        }
      },
      schedulerTest: {
        script: 'scheduler.js'
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true
      }
    },
    eslint: {
      options: {},
      target: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS, defaultAssets.client.js, testAssets.tests.server, testAssets.tests.client, testAssets.tests.e2e)
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: defaultAssets.client.css
      }
    },
    ngAnnotate: {
      production: {
        files: {
          'public/dist/application.js': defaultAssets.client.js
        }
      }
    },
    uglify: {
      production: {
        options: {
          mangle: false
        },
        files: {
          'public/dist/application.min.js': 'public/dist/application.js'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dist/application.min.css': defaultAssets.client.css
        }
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          src: defaultAssets.client.sass,
          ext: '.css',
          rename: function (base, src) {
            return src.replace('/scss/', '/css/');
          }
        }]
      }
    },
    less: {
      dist: {
        files: [{
          expand: true,
          src: defaultAssets.client.less,
          ext: '.css',
          rename: function (base, src) {
            return src.replace('/less/', '/css/');
          }
        }]
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    mochaTest: {
      src: testAssets.tests.server,
      options: {
        reporter: 'spec',
        timeout: 10000
      }
    },
    mocha_istanbul: {
      coverage: {
        src: testAssets.tests.server,
        options: {
          print: 'detail',
          coverage: true,
          require: 'test.js',
          coverageFolder: 'coverage/server',
          reportFormats: ['cobertura', 'lcovonly'],
          check: {
            lines: 40,
            statements: 40
          }
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js',
        noColor: false,
        webdriverManagerUpdate: true
      },
      e2e: {
        options: {
          args: {} // Target-specific arguments
        }
      }
    },
    copy: {
      localConfig: {
        src: 'config/env/local.example.js',
        dest: 'config/env/local-development.js',
        filter: function () {
          return !fs.existsSync('config/env/local-development.js');
        }
      }
    },
    exec: {
      schedulerTest: {
        cmd: 'node tests/scheduler-test.js'
      },
      dartTest: {
        cmd: 'mocha tests/dart.spec.js'
      },
      mailTest: {
        cmd: 'mocha tests/mail.spec.js'
      },
      smsTest: {
        cmd: 'mocha tests/cafe24.sms.spec.js'
      },
      articleCounterTest: {
        cmd: 'node tests/article.counter.spec.js'
      }
    }
  });

  grunt.event.on('coverage', function (lcovFileContents, done) {
    // Set coverage config so karma-coverage knows to run coverage
    testConfig.coverage = true;
    require('coveralls').handleInput(lcovFileContents, function (err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-protractor-coverage');

  // Make sure upload directory exists
  grunt.task.registerTask('mkdir:upload', 'Task that makes sure upload directory exists.', function () {
    // Get the callback
    var done = this.async();

    grunt.file.mkdir(path.normalize(__dirname + '/modules/users/client/img/profile/uploads'));

    done();
  });

  // Connect to the MongoDB instance and load the models
  grunt.task.registerTask('mongoose', 'Task that connects to the MongoDB instance and loads the application models.', function () {
    // Get the callback
    var done = this.async();

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    // Connect to database
    mongoose.connect(function (db) {
      done();
    });
  });

  // Drops the MongoDB database, used in e2e testing
  grunt.task.registerTask('dropdb', 'drop the database', function () {
    // async mode
    var done = this.async();

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    mongoose.connect(function (db) {
      db.connection.db.dropDatabase(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully dropped db: ', db.connection.db.databaseName);
        }
        db.connection.db.close(done);
      });
    });
  });

  // signup test user
  grunt.task.registerTask('signup', 'signup test user', function () {
    // async mode
    var done = this.async();

    var user1 = {
      corpCode: '005930',
      corpName: '거북선최고',
      email: 'test.user@test.com',
      displayName: '이순신',
      password: 'P@$$w0rd!!',
      provider: 'local',
      telephone: '032-1234-5678',
      cellphone: '010-2187-3886',
      emailConfirmed: true,
      corpCodeConfirmed: true,
      telephoneConfirmed: true,
      roles: ['user', 'admin']
    };

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    mongoose.connect(function (db) {
      var mongoose = require('mongoose'),
        schemaUser = require('./modules/users/server/models/user.server.model'),
        schemaRepoter = require('./modules/article-senders/server/models/reporter.server.model'),
        User = mongoose.model('User'),
        Reporter = mongoose.model('Reporter');

      var user = new User(user1);
      user.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('success signup test user');
        }

        var reporter1 = {
          name: 'reporter1',
          corpName: 'corpName1',
          email: 'reporter1@gmail.com',
          telephone: '02-98760-5432',
          cellphone: '010-9876-5432',
          priority: 0
        };

        var reporter2 = {
          name: 'reporter2',
          corpName: 'corpName2',
          email: 'reporter2@gmail.com',
          telephone: '02-98760-5431',
          cellphone: '010-9876-5431',
          priority: 1
        };

        var reporter = new Reporter(reporter1);
        reporter.save(function (err) {
          db.connection.db.close(done);
        });

      });
    });
  });

  grunt.task.registerTask('insertRepoter', 'Insert Repoter', function () {
    // async mode
    var done = this.async();

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    mongoose.connect(function (db) {
      var mongoose = require('mongoose'),
        schemaRepoter = require('./modules/article-senders/server/models/reporter.server.model'),
        Reporter = mongoose.model('Reporter');

      var reporter1 = {
        name: '김기자',
        corpName: 'YTN',
        email: 'noruya@gmail.com',
        telephone: '02-98760-5432',
        cellphone: '010-9876-5432',
        priority: 0
      };

      var reporter2 = {
        name: '박기자',
        corpName: 'MBN',
        email: 'smartkoh@gmail.com',
        telephone: '02-98760-5431',
        cellphone: '010-9876-5431',
        priority: 1
      };

      var reporter3 = {
        name: '남기자',
        corpName: 'SBS',
        email: 'zidell@gmail.com',
        telephone: '02-98760-5431',
        cellphone: '010-9876-5431',
        priority: 2
      };

      Reporter.remove();
      var reporter = new Reporter(reporter1);
      reporter.save(function (err) {

        var reporter = new Reporter(reporter2);
        reporter.save(function (err) {
          var reporter = new Reporter(reporter3);
          reporter.save(function (err) {
            db.connection.db.close(done);
          });
        });
      });
    });
  });

  grunt.task.registerTask('server', 'Starting the server', function () {
    // Get the callback
    var done = this.async();

    var path = require('path');
    var app = require(path.resolve('./config/lib/app'));
    var server = app.start(function () {
      done();
    });
  });

  grunt.task.registerTask('schedulerTest', 'Sarting scheduler test', ['exec:schedulerTest']);
  grunt.task.registerTask('dartTest', 'Sarting dart test', ['exec:dartTest']);
  grunt.task.registerTask('mailTest', 'Sarting mail test', ['exec:mailTest']);
  grunt.task.registerTask('smsTest', 'Sarting sms test', ['exec:smsTest']);
  grunt.task.registerTask('articleCounterTest', 'Sarting articleCounter test', ['exec:articleCounterTest']);

  grunt.registerTask('dev:reporter', ['env:dev', 'insertRepoter']);
  grunt.registerTask('prod:reporter', ['env:prod', 'insertRepoter']);

  // Lint CSS and JavaScript files.
  grunt.registerTask('lint', ['sass', 'less', 'eslint', 'csslint']);

  // Lint project files and minify them into two production files.
  grunt.registerTask('build', ['env:dev', 'lint', 'ngAnnotate', 'uglify', 'cssmin']);

  // Run the project tests
  grunt.registerTask('test', ['env:test', 'lint', 'mkdir:upload', 'copy:localConfig', 'server', 'mochaTest', 'karma:unit', 'protractor']);
  grunt.registerTask('test:server', ['env:test', 'lint', 'server', 'mochaTest']);
  grunt.registerTask('test:client', ['env:test', 'lint', 'karma:unit']);
  grunt.registerTask('test:e2e', ['env:test', 'dropdb', 'signup', 'server', 'protractor']);
  grunt.registerTask('test:scheduler', ['env:test', 'schedulerTest']);
  grunt.registerTask('test:runScheduler', ['env:test', 'nodemon:schedulerTest']);
  grunt.registerTask('test:dart', ['env:test', 'lint', 'dartTest']);
  grunt.registerTask('test:mail', ['env:test', 'lint', 'mailTest']);
  grunt.registerTask('test:sms', ['env:test', 'lint', 'smsTest']);
  grunt.registerTask('test:articleCounter', ['env:test', 'articleCounterTest']);

  grunt.registerTask('dev:runScheduler', ['env:dev', 'nodemon:schedulerTest']);

  // Run project coverage
  grunt.registerTask('coverage', ['env:test', 'lint', 'mocha_istanbul:coverage', 'karma:unit']);

  // Run the project in development mode
  grunt.registerTask('default', ['env:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);

  // Run the project in debug mode
  grunt.registerTask('debug', ['env:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:debug']);

  // Run the project in production mode
  grunt.registerTask('prod', ['build', 'env:prod', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);

  grunt.registerTask('testserver', ['env:test', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:debug']);

};
