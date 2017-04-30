'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  express = require('./express'),
  db = require('./sequelize'),
  chalk = require('chalk');

module.exports.init = function init(callback) {
  var app = express.init(db);
  if (callback) callback(app, db, config);
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

      console.log('========================================================');
      // Logging initialization
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
      console.log(chalk.green('Server:\t\t\t\t' + server));
      console.log(chalk.green('Port:\t\t\t\t' + config.port));
      console.log(chalk.green('Database:\t\t\tMysql:' + config.db.host + ':' + config.db.port));
      if (process.env.NODE_ENV === 'secure') {
        console.log(chalk.green('HTTPs:\t\t\t\ton'));
      }
      console.log(chalk.green('App version:\t\t\t' + config.meanjs.version));
      if (config.meanjs['meanjs-version'])
        console.log(chalk.green('MEAN.JS version:\t\t' + config.meanjs['meanjs-version']));
      console.log('========================================================');

      if (callback) callback(app, db, config);
    });

  });

};
