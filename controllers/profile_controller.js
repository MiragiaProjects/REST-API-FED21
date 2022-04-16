const debug = require('debug')('books:profile_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');



  ///////////////// ALBUM //////////////////
/**
 * Get all resources
 *
 * GET /
 */
const indexAlbum = async (req, res) => {
	// load in albums
	await req.user.load('albums')
	// send data
	res.send({
		status: 'success',
		data: {
            albums: req.user.related('albums')
        }
	});
}



/**
 * Get a specific resource
 *
 * GET /:albumId
 */
const showAlbum = async (req, res) => {
	// find albums related to our user
	const user = await models.User.fetchById(req.user.id, { withRelated: ['albums']});
	const albumsUser = user.related('albums');
	
	const album = albumsUser.find(album => album.id == req.params.albumId);

	if(!album){
		return res.status(404).send({
			status: 'fail',
			data: 'No albums here'
		});
	}

	const albumsId = await models.Album.fetchById(req.params.albumsId, { withRelated: ['photos']});

	res.send({
		status: 'success',
		data: albumsId
	});
}

/**
 * Store a new album
 *
 * POST /
 */
const storeAlbum = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	
	const validData = matchedData(req);

	try {
		const album = await new models.Album(validData).save();
		debug("Created new album successfully: %O", album);

		res.send({
			status: 'success',
			data: {
                album,
            }
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when creating a new album.',
		});
		throw error;
	}
}

/**
 * Update a specific resource
 *
 * PUT /:updateId
 */
const updateAlbum = async (req, res) => {
	const albumId = req.params.albumId;

	// make sure album exists
	const album = await new models.Album({ id: albumId }).fetch({ require: false });
	if (!album) {
		debug("album to update was not found. %o", { id: albumId });
		res.status(404).send({
			status: 'fail',
			data: 'Album Not Found',
		});
		return;
	}

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
		const updatedAlbum = await album.save(validData);
		debug("Updated album successfully: %O", updatedAlbum);

		res.send({
			status: 'success',
			data: {
                album,
            }
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when updating a new album.',
		});
		throw error;
	}
}

const addPhotoToAlbum = async (req, res) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).send({
			status:'fail',
			data: errors.array() 
		});
	}
	const validData = matchedData(req);

	const user = await models.User.fetchById(req.user.id, { withRelated: ['albums', 'photos']});
	const albumsUser = user.related('albums').find(album => album.id == req.params.albumId);
	const photosUser = user.related('photos').find(photo => photo.id == validData.photo_id);

	const albums = await models.Album.fetchById(req.params.albumId, {withRelated: ['photos']});
	const photosAlbum = albums.related('photos').find(photo => photo.id == validData.photo_id);

	// vi kollar om albumete med det idet vi frågar om finns
	if(!albumsUser) {
		return res.send({
			status: 'fail',
			data: "No albums here"
		});
	}

	// Vi kollar om fotot vi frågar om redan finns i albumet
	if(!photosAlbum) {
		return res.send({
			status: 'fail',
			data: 'No photos here'
		});
	}
	// Kollar om om fotot med de idet vi frågar om finns
	if(!photosUser) {
		return res.status(404).send({
			status:'fail',
			data:'No photos here'
		})
	}

	try {
		const result = await albums.photos().attach(validData.photo_id);
		debug('Added photo to album successfully:%0', result)

		res.status(200).send({
			status:'success'
		})
	
	res.status(200).send({
		status: 'success',
		data: null
	});

	} catch (error) {
		res.status(500).send({
			status: 'Error',
			message: 'Exception thrown in database when adding a photo to an album'
		});
	}throw error;
}



////////////////// PHOTO ///////////////////////////
/**
 * Get all resources
 *
 * GET /
 */
 const indexPhoto = async (req, res) => {
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
const showPhoto = async (req, res) => {
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
const storePhoto = async (req, res) => {
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
		debug("Created new photo successfully: %O", photo);

		res.send({
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
const updatePhoto = async (req, res) => {

	const errors = validationResult(req);
	if(!errors.isEmpty()) {
		return res.status(422).send({
			status: 'fail',
			data: errors.array()
		});
	}

	const validData = matchedData(req);

	const user = await models.User.fetchById(req.user.id, { withRelated: [photos] });
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
	//ALBUM
	indexAlbum,
	showAlbum,
	storeAlbum,
	updateAlbum,
	addPhotoToAlbum,
	//PHOTO
	indexPhoto,
	showPhoto,
	storePhoto,
	updatePhoto,
}