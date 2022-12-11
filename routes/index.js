const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userValidationRules = require('../validation/user');
const authController = require('../controllers/auth_controller');


/* GET / */
router.get('/', (req, res, next) => {
	res.send({ success: true, data: { msg: 'ey yo sup' }});
});

router.post('/register', userValidationRules.createRules, authController.register);

router.use('/albums',auth.basic, require('./albums'));
router.use('/photos',auth.basic, require('./photos'));



module.exports = router;
