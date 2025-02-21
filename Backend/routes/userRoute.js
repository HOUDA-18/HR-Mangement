const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.getUsers);
router.get('/rhmembers',userController.getRHMember);

module.exports = router;
