const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/employees', userController.getEmployees);

router.get('/rhmembers', userController.getRHMembers);
router.get('/users', userController.getUsers);

module.exports = router;
