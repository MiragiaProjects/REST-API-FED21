/**
 * Example Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');
 
 /**
  * Create user validation rules
  *
  */
  const createRules = [
	body('email').exists().isEmail().custom(async value => {
		const email = await new models.User({ email: value }).fetch({ require: false });
		if (email) {
			return Promise.reject("Email already exists.");
		}

		return Promise.resolve();
	}),
	body('password').exists().isLength({ min: 4 }),
	body('first_name').exists().isLength({ min: 2 }),
	body('last_name').exists().isLength({ min: 2 }),
];
 
 
 
 module.exports = {
     createRules,
 }