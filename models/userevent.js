'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserEvent extends Model {
    static associate(models) {
      // define association here
    }
  }
  UserEvent.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'UserEvent',
  });
  return UserEvent;
};
