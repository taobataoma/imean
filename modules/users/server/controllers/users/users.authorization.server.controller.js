'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  User = db.User;

/**
 * User middleware
 */
exports.userById = function (req, res, next, id) {
  User.findOne({
    where: {
      id: id
    },
    attributes: {
      exclude: ['salt', 'password', 'providerData']
    }
  }).then(function (user) {
    if (!user) {
      return next(new Error('Failed to load user ' + id));
    }
    req.profile = user;
    next();
  }).catch(function (err) {
    return next(err);
  });
};
