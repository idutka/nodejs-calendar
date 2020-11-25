const express = require('express');
const validator = require('../utils/validator');
const {verify} = require('../utils/auth');
const auth = require('../controllers/auth.js');
const router = express.Router();

router.post('/login', validator.validateSchema(auth.schema), auth.login);
router.post('/logout', verify, auth.logout);
router.post('/refresh_tokens', verify, auth.refreshTokens);
router.get('/check_access', verify, auth.checkAccess);

module.exports.router = router;
