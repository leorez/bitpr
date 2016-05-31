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
  smsAlertedTime: {
    type: Date
  },
  sent: {
    type: Date
  },
  displayed: {
    // 홈페이지에 올라갔는지 여부
    type: Boolean,
    default: false
  },
  status: {
    // 'None', 'Reserved', 'Sent', 'Error', 'Canceled', 'ReSend' : 재전송
    type: String,
    default: 'None',
    trim: true
  },
  emails: {
    type: String,
    default: '',
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
  fileOrigin: {
    // 보도자료 원본이름
    type: String,
    trim: true
  },
  image1: {
    type: String,
    trim: true
  },
  image1Orgin: {
    // 원본이름
    type: String,
    trim: true
  },
  image2: {
    type: String,
    trim: true
  },
  image2Orgin: {
    // 원본이름
    type: String,
    trim: true
  },
  image3: {
    type: String,
    trim: true
  },
  image3Orgin: {
    // 원본이름
    type: String,
    trim: true
  },
  reserveTime: {
    type: Number,
    default: 1,
    required: 'ReserveTime cannot be blank'
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
  },
  dspType: {
    // 공시유형
    type: String,
    trim: true
  },
  sender: {
    // 발송인
    type: String,
    trim: true
  },
  contact: {
    // 연락처
    type: String,
    trim: true
  },
  subheadline: {
    // 서브헤드라인
    type: String,
    trim: true
  },
  lead: {
    // 리드
    type: String,
    trim: true
  },
  main: {
    // 본문
    type: String,
    trim: true
  },
  detail: {
    // 세부사실
    type: String,
    trim: true
  },
  corpSummary: {
    // 회사요약
    type: String,
    trim: true
  }
});

mongoose.model('ArticleSender', ArticleSenderSchema);
