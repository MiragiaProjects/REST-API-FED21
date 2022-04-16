const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const userValidationRules = require('../validation/user');
const albumValidationRules = require('../validation/album');
const photoValidationRules = require('../validation/photo');

////////////////////////// ALBUMS /////////////////////////////////////

/* Get all albums */
router.get('/', profileController.indexAlbum);

/* Get a specific album */
router.get('/:albumId', profileController.showAlbum);

/* Store a new album */
router.post('/', albumValidationRules.createRules, profileController.storeAlbum);

/* Update a specific album */
router.put('/:albumId', albumValidationRules.updateRules, profileController.updateAlbum);

/* Add photo to album */
router.post('/:albumId/photos', albumValidationRules.addPhoto, profileController.addPhotoToAlbum);

////////////////////////// PHOTOS //////////////////////////////////

/* Get all photos */
router.get('/', profileController.indexPhoto);

/* Get a specific photo */
router.get('/:photoId', profileController.showPhoto);

/* Store a new photo */
router.post('/', photoValidationRules.createRules, profileController.storePhoto);

/* Update a specific photo */
router.put('/:photoId', photoValidationRules.updateRules, profileController.updatePhoto);


module.exports = router;
