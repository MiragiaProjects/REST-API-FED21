// I DONT REALLY NEED THIS DO I!?!?

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user');


/* Get a specific resource */
router.get('/:userId', userController.show);

/* Store a new resource */
router.post('/', userValidationRules.createRules, userController.store);

/* Update a specific resource */
router.put('/:userId', userValidationRules.updateRules, userController.update);


module.exports = router;