'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  db = require(path.resolve('./config/lib/sequelize')),
  User = db.User;


/**
 * Module init function.
 */
module.exports = function (app, db) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      where: {id: id},
      attributes: {exclude: ['salt', 'password', 'providerData']}
    }).then(function (user) {
      return done(null, user);
    }).catch(function (err) {
      return done(err, null);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};
