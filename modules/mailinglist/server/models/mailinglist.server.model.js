'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  validator = require('validator'),
  Schema = mongoose.Schema;

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return (validator.isEmail(email, { require_tld: false }));
};

/**
 * Mailinglist Schema
 */
var MailinglistSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  group: {
    type: Schema.ObjectId,
    ref: 'MailinglistGroup'
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: '이름은 필수입니다.'
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: '이메일은 필수입니다.',
    lowercase: true,
    validate: [validateLocalStrategyEmail, '형식에 맞지않는 이메일 주소입니다.']
  }
});

mongoose.model('Mailinglist', MailinglistSchema);
