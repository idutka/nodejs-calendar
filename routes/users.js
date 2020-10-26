const express = require('express');
const validator = require('../utils/validator');
const users = require('../controllers/users.js');
const router = express.Router();

router.get('/', users.findAll);
router.get('/:userId', users.findOne);
router.post('/', validator.validateSchema(users.schema), users.create);
router.put('/:userId', validator.validateSchema(users.schema), users.update);
router.delete('/:userId', users.delete);

module.exports.router = router;
