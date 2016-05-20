(function () {
  'use strict';

  var should = require('should'),
    mongoose = require('mongoose'),
    Reporter = mongoose.model('Reporter');

  var addr;

  describe('Reporter Model unit Tests', function () {
    beforeEach(function (done) {
      addr = new Reporter({

      });
    });

    describe('Method Save', function () {
      it('Should be able to save without problems', function (done) {
        return addr.save(function (err) {
          should.not.exist(err);
          done();
        });
      });
    });
  });
}());

