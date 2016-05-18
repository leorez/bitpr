'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * ArticleSender Schema
 */
var ArticleSenderSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  reserved: {
    type: Date
  },
  canceled: {
    type: Date
  },
  sent: {
    type: Date
  },
  status: {
    // 'None', 'Reserved', 'Sent', 'Error', 'Canceled', 'ReSend' : 재전송
    type: String,
    default: 'None',
    trim: true
  },
  smsAlerted: {
    // 발송 5분전에 sms통보했는지 여부
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true,
    required: 'Content cannot be blank'
  },
  file: {
    type: String,
    trim: true
  },
  image1: {
    type: String,
    trim: true
  },
  image2: {
    type: String,
    trim: true
  },
  image3: {
    type: String,
    trim: true
  },
  reserveTime: {
    type: Number,
    default: 1,
    required: 'ReserveTime cannot be blank'
  },
  beToDart: {
    type: Boolean,
    default: false
  },
  sendCount: {
    type: Number,
    default: 1,
    required: 'SendCount cannot be blank'
  },
  fare: {
    type: Number,
    required: 'Fare cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('ArticleSender', ArticleSenderSchema);
