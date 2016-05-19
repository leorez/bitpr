(function () {
  'use strict';
  var should = require('should'),
    chalk = require('chalk'),
    dart = require('./dart');

  describe('Dart api tests', function() {
    it('Should success in 검색 API ', function (done) {
      var options = {
        crp_cd: '005930',
        end_dt: '',
        start_dt: '',
        fin_rpt: 'Y',
        dsp_tp: 'A',
        bsn_tp: ''
      };

      dart.search(options, function (error, response) {
        console.log(chalk.green(JSON.stringify(response)));
        should(error).not.be.ok();
        done();
      })
    });
  });
}());

