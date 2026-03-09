const express = require('express');
const { compileCode } = require('../controllers/compileController');

const router = express.Router();

router.post('/compile', compileCode);

module.exports = router;
