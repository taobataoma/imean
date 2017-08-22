'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  validator = require('validator'),
  db = require(path.resolve('./config/lib/sequelize')),
  User = db.User;

var whitelistedFields = ['firstName', 'lastName', 'email', 'username'];

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  if (user) {
    // Update whitelisted fields only
    user = _.extend(user, _.pick(req.body, whitelistedFields));

    user.updatedAt = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save().then(function () {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }).catch(function (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var existingImageUrl;

  // Filtering to upload only images
  var multerConfig = config.uploads.profile.image;
  multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  var upload = multer(multerConfig).single('newProfilePicture');

  if (user) {
    existingImageUrl = user.profileImageURL;
    uploadImage()
      .then(updateUser)
      .then(deleteOldImage)
      .then(login)
      .then(function () {
        res.json(user);
      })
      .catch(function (err) {
        console.log(err);
        res.status(422).send(err);
      });
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updateUser() {
    return new Promise(function (resolve, reject) {
      user.profileImageURL = config.uploads.profile.image.dest + req.file.filename;

      user.save().then(function () {
        resolve();
      }).catch(function (err) {
        reject(err);
      });
    });
  }

  function deleteOldImage() {
    return new Promise(function (resolve, reject) {
      if (existingImageUrl !== user.getProfileImageDefault()) {
        fs.unlink(existingImageUrl, function (unlinkError) {
          if (unlinkError) {

            // If file didn't exist, no need to reject promise
            if (unlinkError.code === 'ENOENT') {
              console.log('Removing profile image failed because file did not exist.');
              return resolve();
            }

            console.error(unlinkError);

            reject({
              message: 'Error occurred while deleting old profile picture'
            });
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  function login() {
    return new Promise(function (resolve, reject) {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          resolve();
        }
      });
    });
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  // Sanitize the user - short term solution. Copied from core.server.controller.js
  // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      id: req.user.id,
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      createdAt: req.user.createdAt.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.json(safeUserObject || null);
};
