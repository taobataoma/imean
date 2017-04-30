'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')),
  User = db.User;

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save().then(function () {
    res.json(user);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.destroy().then(function () {
    res.json(user);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.findAll({
    attributes: {exclude: ['salt', 'password', 'providerData']},
    order: 'createdAt DESC'
  }).then(function (users) {
    res.json(users);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  User.findOne({
    where: {id: id},
    attributes: {exclude: ['salt', 'password', 'providerData']}
  }).then(function (user) {
    if (!user) {
      return next(new Error('Failed to load user ' + id));
    }
    req.model = user;
    next();
  }).catch(function (err) {
    return next(err);
  });
};
