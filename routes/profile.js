const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile_controller');
const userValidationRules = require('../validation/user');



//  Get logged in user's profile
 
router.get('/', profileController.getProfile);


 // Update logged in user's profile
 
router.put('/', userValidationRules.updateRules, profileController.updateProfile);


// Get authenticated user's albums
 
router.get('/albums', profileController.getAlbums);


 // Add a album to the logged user
 
 
router.post('/albums', userValidationRules.createRules, profileController.addAlbum);

// Get authenticated user's photos
 
router.get('/albums', profileController.getPhotos);


 // Add a photos to the logged user
 
 
router.post('/albums', userValidationRules.createRules, profileController.addPhoto);

module.exports = router;