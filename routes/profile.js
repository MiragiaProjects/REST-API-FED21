const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const userValidationRules = require('../validation/user');
const albumValidationRules = require('../validation/album');
const photoValidationRules = require('../validation/photo');



//  Get logged in user's profile
 
router.get('/', profileController.getProfile);


 // Update logged in user's profile
 
router.put('/', userValidationRules.updateRules, profileController.updateProfile);


// Get authenticated user's albums
 
router.get('/albums', profileController.getAlbums);


 // Add a album to the logged user
 
 
router.post('/albums', albumValidationRules.createRules, profileController.addAlbum);

// Update an album (logged in)

router.put('/albums', albumValidationRules.updateRules, profileController.updateAlbum);

// Get authenticated user's photos
 
router.get('/photos', profileController.getPhotos);


 // Add a photos to the logged user
 
 
router.post('/photos', photoValidationRules.createRules, profileController.addPhoto);

// Update photo (logged in)

router.put('/photos', photoValidationRules.updateRules, profileController. updatePhoto);

// add a photo to an album

router.post('/albumPhoto', profileController.addPhotoToAlbum);


module.exports = router;