'use strict';

module.exports = function (sequelize, DataTypes) {

  var Article = sequelize.define('Article',
    {
      title: {
        type: DataTypes.STRING,
        defaultValue: '',
        comment: 'title'
      },
      content: {
        type: DataTypes.TEXT,
        comment: 'content'
      }
    },
    {
      comment: 'article table',

      associate: function (models) {
        Article.belongsTo(
          models.User,
          {foreignKey: '_user_id'}
        );
      }
    }
  );

  return Article;
};
