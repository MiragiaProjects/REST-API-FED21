// I DONT REALLY NEED THIS DO I????


const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album');

/* Get all albums */
router.get('/', albumController.index);

/* Get a specific album */
router.get('/:albumId', albumController.show);

/* Store a new album */
router.post('/', albumValidationRules.createRules, albumController.store);

/* Update a specific album */
router.put('/:albumId', albumValidationRules.updateRules, albumController.update);

/* Add photo to album */
router.post('/:albumId/photos', albumValidationRules.addPhoto, albumController.addPhotoToAlbum);


module.exports = router;
