const express = require('express');
const router = express.Router();
// Import des logiques de routes des utilisateurs
const userCtrl = require('../controllers/user');

/* Routes pour les utilisateurs */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;