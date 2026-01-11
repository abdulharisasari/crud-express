const router = require('express').Router();
const { loginWithFirebase } = require('../controllers/auth.controller');

router.post('/login', loginWithFirebase);

module.exports = router;
