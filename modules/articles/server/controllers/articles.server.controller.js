'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')),
  Article = db.Article,
  User = db.User;

/**
 * Create an article
 */
exports.create = function (req, res) {
  var article = Article.build(req.body);
  article._user_id = req.user.id;

  article.save().then(function () {
    res.json(article);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  var article = req.article ? req.article.toJSON() : {};

  article.isCurrentUserOwner = !!(req.user && article.user && article.user._id.toString() === req.user._id.toString());

  res.json(article);
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save().then(function () {
    res.json(article);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.destroy().then(function () {
    res.json(article);
  }).catch(function (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Article.findAll({
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ],
    order: 'createdAt DESC'
  }).then(function (articles) {
    return res.jsonp(articles);
  }).catch(function (err) {
    return res.status(422).send(err);
  });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {
  Article.findOne({
    where: {id: id},
    include: [
      {
        model: User,
        attributes: ['displayName']
      }
    ]
  }).then(function (article) {
    if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  }).catch(function (err) {
    return next(err);
  });
};
