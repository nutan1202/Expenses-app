const express = require('express');
const { createUser, getUser } = require('../controllers/userController');
const router = express.Router();

router.post('/users', createUser); // Create a new user
router.get('/users/:id', getUser); // Get user details

module.exports = router;
