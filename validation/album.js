/**
 * Example Validation Rules
 */

 const { body } = require('express-validator');
 const models = require('../models');
 
 /**
  * Create Album validation rules
  *
  */
  const createRules = [
	body('title').exists().isLength({ min: 4 }),
	
];
 
 /**
  * Update Album validation rules
  *
  */
  const updateRules = [
	body('title').exists().isLength({ min: 4 }),
];

	const addPhoto = [
		body('photo_id').exists().isInt(),
	];
 
 module.exports = {
    createRules,
    updateRules,
	  addPhoto
 }