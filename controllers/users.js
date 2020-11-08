const Joi = require('joi');

const logger = require('../utils/logger')

const db = require('../models');
const User = db.User;

const schema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string(),
});
module.exports.schema = schema;

module.exports.create = async (req, res) => {
  try {
    const {firstName, lastName, email} = req.body;
    const newUser = await User.create({firstName, lastName, email});
    res.json(newUser);
  } catch (e) {
    const error = e.errors?.map(({message}) => message).join(', ');
    const message = error || e.message || 'Some error occurred while creating a new user';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (e) {
    const message = e.message || 'Some error occurred while receiving users';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.findOne = async (req, res) => {
  try {
    const {userId} = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.sendStatus(404);
    }
    res.json(user);
  } catch (e) {
    const message = e.message || 'Some error occurred while receiving a user';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.update = async (req, res) => {
  try {
    const {userId} = req.params;
    const [updated] = await User.update(req.body, {
      where: {id: userId}
    })
    if (!updated) {
      return res.sendStatus(404);
    }
    const updatedUser = await User.findByPk(userId);
    res.json(updatedUser);
  } catch (e) {
    const error = e.errors?.map(({message}) => message).join(', ');
    const message = error || e.message || 'Some error occurred while updating a user';
    res.status(500).send({message});
    logger.warn(message);
  }
};

module.exports.delete = async (req, res) => {
  try {
    const {userId} = req.params;
    await User.destroy({
      where: {id: userId}
    })
    res.sendStatus(204);
  } catch (e) {
    const message = e.message || 'Some error occurred while deleting a user';
    res.status(500).send({message});
    logger.warn(message);
  }
};
