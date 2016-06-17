'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * DailyCount Schema
 */
var DailyCountSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  date: {
    type: String,
    trim: true,
    default: ''
  },
  keyword: {
    type: String,
    trim: true,
    default: ''
  },
  count: {
    type: Number
  }
});

mongoose.model('DailyCount', DailyCountSchema);
