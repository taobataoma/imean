'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var _ = require('lodash');
var config = require('../config');
var winston = require('winston');
var chalk = require('chalk');
var db = {};


console.log(chalk.green('Initializing Sequelize...'));

// create your instance of sequelize
var sequelize =
  new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    timezone: '+08:00',
    set: {
      sql_mode: ''
    },
    dialectOptions: {
      multipleStatements: true
    },
    logging: config.db.option.enableSequelizeLog ? winston.info : false
  });

sequelize.query('SET GLOBAL sql_mode = \'\'');

// loop through all files in models directory ignoring hidden files and this file
config.files.server.models.forEach(function (modelPath) {
  console.log(chalk.green('Loading model file ' + modelPath));
  var model = sequelize.import(path.resolve(modelPath));
  db[model.name] = model;
});

// invoke associations on each of the models
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});

// Synchronizing any model changes with database.
// set FORCE_DB_SYNC=true in the environment, or the program parameters to drop the database,
//   and force model changes into it, if required;
// Caution: Do not set FORCE_DB_SYNC to true for every run to avoid losing data with restarts
sequelize
  .sync({
    force: config.db.option.FORCE_DB_SYNC,
    logging: config.db.option.enableSequelizeLog ? winston.info : false
  })
  .then(function () {
    console.log(chalk.green('Database ' + (config.db.option.FORCE_DB_SYNC ? '*DROPPED* and ' : '') + 'synchronized OK!'));
  }).catch(function (err) {
    winston.error('An error occurred: ', err);
  });

// assign the sequelize variables to the db object and returning the db.
module.exports = _.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);
