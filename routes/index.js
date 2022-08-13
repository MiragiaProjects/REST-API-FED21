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

router.use('/album',auth.basic, require('./album'));
router.use('/photo',auth.basic, require('./photo'));
//router.use('/profile',auth.basic, require('./profile'))


module.exports = router;
