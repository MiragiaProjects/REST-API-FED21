const debug = require('debug')('books:profile_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

/**
 * Get all resources
 *
 * GET /
 */
 const index = async (req, res) => {
	const user = await new models.User({id: req.user.id}).fetch({ withRelated: ['photos']});

	res.status(200).send({
		status: 'success',
		data: user.related('photos'),
	})
}

/**
 * Get a specific resource
 *
 * GET /:photoId
 */
const show = async (req, res) => {
const user = await models.User.fetchById(req.user.id, { withRelated: ['photos'] });
const photosUser = user.related('photos');

	const photo = photosUser.find(photo => photo.id == req.params.photoId);
	if(!photo) {
		return res.status(404).send({
			status: 'fail',
			data: 'No photo could be found'
		});
	}
	res.status(200).send({
		status: 'success',
		data: photo
	});
}

/**
 * Store a new resource
 *
 * POST /
 */
const store = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	validData.user_id = req.user.id;

	try {
		const photo = await new models.Photo(validData).save();

		res.status(200).send({
			status: 'success',
			data: {
                photo,
            }
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new photo.',
		});
		throw error;
	}
}

/**
 * Update a specific resource
 *
 * PUT /:photoId
 */
const update = async (req, res) => {

	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).send({
			status: 'fail',
			data: errors.array()
		});
	}

	const validData = matchedData(req);

	const user = await models.User.fetchById(req.user.id, { withRelated: ['photos'] });
	const photosUser = user.related('photos');

	const photo = photosUser.find(photo => photo.id == req.params.photoId);
	if(!photo) {
		return res.status(404).send({
			status: 'fail',
			data: "No photos here"
		});
	}

	try {
		const updatedPhoto = await photo.save(validData);

		return res.status(200).send({
			status: 'success',
			data: updatedPhoto
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a photo'
		});
		throw error;
	}
}


module.exports = {
	index,
	show,
	store,
	update,
}