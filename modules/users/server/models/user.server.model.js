'use strict';

/**
 * User Model
 */

var crypto = require('crypto'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define('User',
    {
      firstName: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      lastName: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      displayName: {
        type: DataTypes.STRING(100),
        defaultValue: ''
      },
      email: {
        type: DataTypes.STRING(50),
        defaultValue: ''
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        defaultValue: ''
      },
      salt: {
        type: DataTypes.STRING(64),
        defaultValue: ''
      },
      password: {
        type: DataTypes.STRING(128),
        defaultValue: ''
      },
      profileImageURL: {
        type: DataTypes.STRING(128),
        defaultValue: 'modules/users/client/img/profile/default.png'
      },
      roles: {
        type: DataTypes.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user',
        get: function () {
          return [this.getDataValue('roles')];
        }
      },
      provider: {
        type: DataTypes.STRING,
        defaultValue: 'local'
      },
      providerData: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      additionalProvidersData: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      /* For reset password */
      resetPasswordToken: {
        type: DataTypes.STRING(64)
      },
      resetPasswordExpires: {
        type: DataTypes.DATE
      }
    },
    {
      comment: 'user table',

      associate: function (models) {
        User.hasMany(
          models.Article,
          {foreignKey: '_user_id'}
        );
      },

      instanceMethods: {
        toJSON: function () {
          var values = this.get();
          delete values.password;
          delete values.salt;
          delete values.providerData;
          delete values.additionalProvidersData;
          delete values.resetPasswordToken;
          delete values.resetPasswordExpires;
          return values;
        },
        getProfileImageDefault: function () {
          return User.rawAttributes.profileImageURL.defaultValue;
        },
        makeSalt: function () {
          return crypto.randomBytes(16).toString('base64');
        },
        authenticate: function (plainText) {
          return this.encryptPassword(plainText, this.salt) === this.password;
        },
        encryptPassword: function (password, salt) {
          if (!password || !salt) {
            return '';
          }
          salt = new Buffer(salt, 'base64');
          return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
        },
        /**
         * Generates a random passphrase that passes the owasp test.
         * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
         * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
         */
        generateRandomPassphrase: function () {
          return new Promise(function (resolve, reject) {
            var password = '';
            var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

            // iterate until the we have a valid passphrase.
            // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
            while (password.length < 20 || repeatingCharacters.test(password)) {
              // build the random password
              password = generatePassword.generate({
                length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
                numbers: true,
                symbols: false,
                uppercase: true,
                excludeSimilarCharacters: true
              });

              // check if we need to remove any repeating characters.
              password = password.replace(repeatingCharacters, '');
            }

            // Send the rejection back if the passphrase fails to pass the strength test
            if (owasp.test(password).errors.length) {
              reject(new Error('An unexpected problem occured while generating the random passphrase'));
            } else {
              // resolve with the validated passphrase
              resolve(password);
            }
          });
        }
      },

      classMethods: {
        findUniqueUsername: function (username, suffix, callback) {
          var _this = this;
          var possibleUsername = username.toLowerCase() + (suffix || '');

          _this.findOne({
            username: possibleUsername
          }).then(function (user) {
            if (!user) {
              callback(possibleUsername);
            } else {
              return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
          }).catch(function (err) {
            callback(null);
          });
        }
      }
    }
  );

  return User;
};
