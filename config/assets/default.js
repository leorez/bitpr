'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.css',
        // 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/ngprogress/ngProgress.css',
        'public/lib/ng-tags-input/ng-tags-input.css',
        'public/lib/ng-tags-input/ng-tags-input.bootstrap.css',
        'public/lib/angular-material/angular-material.css',
        'public/lib/angular-inline-text-editor/ite.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/ngprogress/build/ngprogress.js',
        'public/lib/ng-tags-input/ng-tags-input.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/underscore/underscore.js',
        'public/lib/angular-clipboard/angular-clipboard.js',
        'public/lib/angular-file-saver/dist/angular-file-saver.bundle.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/highcharts/highcharts.js',
        'public/lib/highcharts/highcharts-more.js',
        'public/lib/angular-inline-text-editor/ite.js',
        'public/lib/rangy/rangy-core.js',
        'public/lib/rangy/rangy-classapplier.js',
        'public/lib/rangy/rangy-highlighter.js',
        'public/lib/rangy/rangy-selectionsaverestore.js',
        'public/lib/rangy/rangy-serializer.js',
        'public/lib/rangy/rangy-textrange.js',
        'public/js/clear.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js',
      'uploads/embed.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: [
      'modules/*/client/views/**/*.html',
      'uploads/embed-test.html'
    ],
    templates: ['build/templates.js'],
    e2eTests: [
      'modules/*/tests/e2e/*.js'
    ],
    tests: [
      'modules/*/tests/client/*.js'
    ]
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html'],
    tests: ['modules/*/tests/server/*.js']
  }
};
