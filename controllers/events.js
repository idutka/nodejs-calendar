const Joi = require('joi');

const logger = require('../utils/logger')

const db = require('../models');
const Event = db.Event;
const User = db.User;
const sequelize = db.sequelize;
const Op = db.Sequelize.Op;

const schema = Joi.object({
  creatorId: Joi.number().required(),
  title: Joi.string().required(),
  location: Joi.string(),
  date: Joi.date().required(),
  duration: Joi.number(),
  participantsIds: Joi.array().items(Joi.number())
});
module.exports.schema = schema;

const userAttributes = ['id', 'email', 'firstName', 'lastName'];
const creator = {model: User, as: 'creator', attributes: userAttributes};
const participants = {
  model: User,
  as: 'participants',
  attributes: userAttributes,
  through: {
    attributes: []
  }
};

module.exports.create = async (req, res) => {
  try {
    const event = await sequelize.transaction(async (transaction) => {
      const {creatorId, title, location, date, duration, participantsIds} = req.body;

      const newEvent = await Event.create({
        creatorId,
        title,
        location,
        date,
        duration,
      }, {
        transaction,
      });

      // todo: do all in single Event.create
      const eventParticipants = await Promise.all(participantsIds.map(id => User.findByPk(id, {transaction})))
      await newEvent.addParticipants(eventParticipants, {transaction});

      return newEvent;
    });

    // todo: return new event with creator and participants in create
    const {id} = event;
    const newEvent = await Event.findByPk(id, {
      attributes: {exclude: ['creatorId']},
      include: [
        creator,
        participants,
      ],
    });

    res.json(newEvent);
  } catch (e) {
    const error = e.errors?.map(({message}) => message).join(', ');
    const message = error || e.message || 'Some error occurred while creating a new event';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const {location} = req.query;
    const where = location ? {location: {[Op.iLike]: location}} : null;
    const events = await Event.findAll({
      where,
      attributes: {exclude: ['creatorId']},
      include: [
        creator,
        participants,
      ],
    });
    res.json(events);
  } catch (e) {
    const message = e.message || 'Some error occurred while receiving events';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.findOne = async (req, res) => {
  try {
    const {eventId} = req.params;
    const event = await Event.findByPk(eventId, {
      attributes: {exclude: ['creatorId']},
      include: [
        creator,
        participants,
      ],
    });
    if (!event) {
      return res.sendStatus(404);
    }
    res.json(event);
  } catch (e) {
    const message = e.message || 'Some error occurred while receiving an event';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.update = async (req, res) => {
  try {
    const event = await sequelize.transaction(async (transaction) => {
      const {eventId} = req.params;
      const {creatorId, title, location, date, duration, participantsIds} = req.body;

      // todo: use single Event.update with association
      const updatedEvent = await Event.findByPk(eventId, {transaction});

      if (!updatedEvent) {
        return null;
      }

      await updatedEvent.setAttributes({title, location, date, duration, creatorId}, {transaction})

      const eventParticipants = await Promise.all(participantsIds.map(id => User.findByPk(id, {transaction})))
      await updatedEvent.setParticipants(eventParticipants, {transaction});

      await updatedEvent.save({transaction});

      return updatedEvent;
    });

    if (!event) {
      return res.sendStatus(404);
    }

    // todo: return updated event with creator and participants in Event.update
    const {id} = event;
    const updatedEvent = await Event.findByPk(id, {
      attributes: {exclude: ['creatorId']},
      include: [
        creator,
        participants,
      ],
    });

    res.json(updatedEvent);
  } catch (e) {
    const error = e.errors?.map(({message}) => message).join(', ');
    const message = error || e.message || 'Some error occurred while updating an event';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const {eventId} = req.params;
    await Event.destroy({
      where: {id: eventId}
    })
    res.sendStatus(204);
  } catch (e) {
    const message = e.message || 'Some error occurred while deleting an event';
    res.status(500).send({message});
    logger.warn(message);
  }
};
