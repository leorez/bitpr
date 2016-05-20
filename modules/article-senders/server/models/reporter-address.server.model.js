(function () {
  'use strict';

  var mongoose = require('mongoose'),
    validator = require('validator'),
    Schema = mongoose.Schema;

  var validateLocalStrategyEmail = function (email) {
    return (validator.isEmail(email, { require_tld: false }));
  };

  var ReporterSchema = new Schema({
    created: {
      type: Date,
      default: Date.now
    },
    name: {
      type: String,
      trim: true,
      required: '성명은 필수사항입니다.'
    },
    corpName: {
      type: String,
      trim: true,
      required: '회사명은 필수사합입니다.'
    },
    telephone: {
      type: String,
      trim: true
    },
    cellphone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      index: {
        unique: true,
        sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
      },
      lowercase: true,
      default: '',
      required: '이메일주소는 필수사항입니다.',
      validate: [validateLocalStrategyEmail, '형식에 맞지않는 이메일 주소입니다.']
    },
    priority: {
      type: Number
    }
  });

  mongoose.model('Reporter', ReporterSchema);
}());

