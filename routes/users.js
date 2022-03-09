const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const userValidationRules = require('../validation/user');


//  Get logged in user's profile
 
router.get('/', userController.getUser);


 // Update logged in user's profile
 
router.put('/', userValidationRules.updateRules, userController.updateUser);


// Get authenticated user's albums
 
router.get('/albums', userController.getAlbums);


 // Add a album to the logged user
 
 
router.post('/albums', userValidationRules.createRules, userController.addAlbum);

// Get authenticated user's photos
 
router.get('/albums', userController.getPhotos);


 // Add a photos to the logged user
 
 
router.post('/albums', userValidationRules.createRules, userController.addPhoto);

module.exports = router;
