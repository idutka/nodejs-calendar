'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator',
      });
      models.User.hasMany(Event, {
        foreignKey: 'creatorId',
        as: 'creator',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Event.belongsToMany(models.User, {
        as: 'participants',
        through: 'UserEvents',
        foreignKey: 'eventId',
        otherKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      models.User.belongsToMany(Event, {
        as: 'events',
        through: 'UserEvents',
        foreignKey: 'userId',
        otherKey: 'eventId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Event.init({
    creatorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    duration: {
      type: DataTypes.BIGINT,
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
