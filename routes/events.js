const express = require('express');
const validator = require('../utils/validator');
const events = require('../controllers/events.js');
const router = express.Router();

router.get('/', events.findAll);
router.get('/:eventId', events.findOne);
router.post('/', validator.validateSchema(events.schema), events.create);
router.put('/:eventId', validator.validateSchema(events.schema), events.update);
router.delete('/:eventId', events.delete);

module.exports.router = router;
