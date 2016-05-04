'use strict';

var mongoose = require('mongoose'),
    mammoth = require('mammoth'),
    errorHandler = require('../../../core/server/controllers/errors.server.controller.js'),
    ArticleSender = mongoose.model('ArticleSender'),
    _ = require('lodash');

var saveArticleSender = function(articleSender, res) {
    articleSender.save(function(err) {
        if(err) {
            console.log(err);
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articleSender);
        }
    });
};

/**
 * Create a Article sender
 */
exports.create = function(req, res) {
    console.log(req.files);
    var data = req.body;
    if(typeof req.files === 'object') {
        data = req.body;
        mammoth.convertToHtml({path: req.files.file.path})
            .then(function(result) {
                data.content = result.value;
                console.log(result.messages);
                saveArticleSender(new ArticleSender(data), res);

            }, function(err) {
                console.log('err: '+err);
                res.status(400).send({
                    message: "'MS Word'가 아닙니다. 파일을 확인해주세요."
                });
            }).done();
    }else {
        var articleSender = new ArticleSender(data);
        articleSender.user = req.user;
        saveArticleSender(articleSender, res);
    }
};

/**
 * Show the current Article sender
 */
exports.read = function(req, res) {
    res.json(req.articleSender);
};

/**
 * Update a Article sender
 */
exports.update = function(req, res) {
    var articleSender = req.articleSender;

    articleSender = _.extend(articleSender, req.body);
    articleSender.save(function(err) {
        if(err) {
            return res.status(400).send({
                messeage: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articleSender);
        }
    });
};

/**
 * Delete an Article sender
 */
exports.delete = function(req, res) {
    var articleSender = req.articleSender;

    articleSender.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articleSender);
        }
    });
};

/**
 * List of Article senders
 */
exports.list = function(req, res) {
    ArticleSender.find().sort('-created').populate('user', 'displayName').exec(function(err, articleSenders) {
        if(err) {
            return res.status(400).send({
                messeage: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(articleSenders);
        }
    });
};


exports.articleSenderByID = function(req, res, next, id) {
    ArticleSender.findById(id).populate('user', 'displayName').exec(function(err, articleSender) {
        if(err) return next(err);
        if(!articleSender) return next(new Error('Failed to load articleSender '+id));

        req.articleSender = articleSender;
        next();
    });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.articleSender.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};
