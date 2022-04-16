/**
 * Example Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');
 
 /**
  * Create Example validation rules
  *
  * Required: title
  * Optional: -
  */
  const createRules = [
	body('title').exists().isLength({ min: 4 }),
	body('user_id').exists().custom(async value => {
		const user = await new models.User({ id: value }).fetch({ require: false });
		if (!user) {
			return Promise.reject(`User with ID ${value} does not exist.`);
		}

		return Promise.resolve();
	}),
];
 
 /**
  * Update Example validation rules
  *
  * Required: -
  * Optional: title
  */
  const updateRules = [
	body('title').optional().isLength({ min: 4 }),
	body('user_id').optional().custom(async value => {
		const user = await new models.User({ id: value }).fetch({ require: false });
		if (!user) {
			return Promise.reject(`User with ID ${value} does not exist.`);
		}

		return Promise.resolve();
	}),
];

	const addPhoto = [
		body('photo_id').exists().isInt(),
	];
 
 module.exports = {
     createRules,
     updateRules,
	 addPhoto
 }