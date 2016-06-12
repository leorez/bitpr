'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CountDailySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  date: {
    type: String,
    trim: true,
    required: '날짜는 필수입니다.'
  },
  keyword: {
    type: String,
    trim: true,
    required: '회사명은 필수사합입니다.'
  },
  total: {
    type: Number
  }
});

mongoose.model('CountDaily', CountDailySchema);

