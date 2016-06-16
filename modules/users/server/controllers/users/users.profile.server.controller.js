'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs-extra'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  appRoot = require('app-root-path'),
  User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (req.user) {
    // Merge existing user
    User.findOne({ _id: req.user._id }, function (err, user) {
      if (err) {
        console.error(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      user = _.extend(user, req.body);
      user.updated = Date.now();
      user.save(function (err) {
        if (err) {
          console.error(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.login(user, function (err) {
            if (err) {
              res.status(400).send(err);
            } else {
              res.json(user);
            }
          });
        }
      });
    });


  } else {
    res.status(400).send({
      message: '로그인이 필요합니다.'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (req.user) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        User.findOne({ _id: req.user._id }, function (err, user) {
          console.log(user);
          user.profileImageURL = config.uploads.profileUpload.dest + req.files.newProfilePicture.name;
          user.updated = Date.now();
          console.log(user);
          var savePath = appRoot + '/' + user.profileImageURL;
          fs.move(req.files.newProfilePicture.path, savePath, function (err) {
            if (err && err.code !== 'EEXIST') {
              console.error(err);
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            console.log('mv success' + savePath);
            user.save(function (saveError) {
              if (saveError) {
                console.error(saveError);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(saveError)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    console.error(err);
                    res.status(400).send(err);
                  } else {
                    res.json(user);
                  }
                });
              }
            });
          });
        });
      }
    });
  } else {
    res.status(400).send({
      message: '로그인이 필요합니다.'
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
