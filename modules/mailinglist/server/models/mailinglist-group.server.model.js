'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Mailinglist Schema
 */
var MailinglistGroupSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: '리스트 이름은 필수입니다.'
  },
  count: {
    type: Number,
    default: 0
  }
});

mongoose.model('MailinglistGroup', MailinglistGroupSchema);
