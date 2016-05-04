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
