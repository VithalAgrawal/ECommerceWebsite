const express = require('express');

const router = express.Router();

const authControllers = require('../controllers/auth.controllers');

router.get('/signup', authControllers.getSignup);

router.post('/signup', authControllers.signup);

router.get('/login', authControllers.getLogin);

router.post('/login', authControllers.login);

router.post('/logout', authControllers.logout);


module.exports = router;