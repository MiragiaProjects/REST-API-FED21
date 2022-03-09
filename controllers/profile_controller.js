// Profile controller
 
const debug = require('debug')('albums:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

const { User } = require('../models');

const { Album } = require('../models');


// Get logged in users info
const getProfile = async (req, res) => {
    res.send({
        status: 'success',
        data: {
            user: req.user,
        }
    });
}

// Update the logged in users info

const updateProfile = async (req, res) => {
    // looking for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // get only the validated data from the request
    const validData = matchedData(req);

    try {
        const updatedUser = await req.user.save(validData);
        debug("Updated user successfully: %O", updatedUser);

        res.send({
            status: 'success',
            data: {
                user: updatedUser,
            },
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when updating a new user.',
        });
        throw error;
    }
}

// Get inlogged users Albums
const getAlbums = async (req, res) => {
   
   
   await req.user.load('albums');

    res.status(200).send({
        status: 'success',
        data: {
            albums: req.user.related('albums'),
        },
    });
}


const addAlbum = async (req, res) => {
   // check for errors

   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(422).send({ status: 'fail', data: errors.array() });
   }


   const validData = matchedData(req);

   const user = await User.fetchById(req.user.user_id, { withRelated: ['albums'] });

   const albums = user.related('albums');

   const existing_album = albums.find(album => album.id == validData.album_id);

   if (existing_album) {
       return res.send({
           status: 'fail',
           data: 'The album already exists.',
       });
   }

   try {
       const result = await user.albums().attach(validData.album_id);
       debug("Added album to user successfully: %O", result);

       res.send({
           status: 'success',
           data: null,
       });

   } catch (error) {
       res.status(500).send({
           status: 'error',
           message: 'Exception thrown in database when adding a album to a user.',
       });
       throw error;
   }
}

   // Update logged in users albums
const updateAlbum = async (req, res) => {
   // looking for validation errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(422).send({ status: 'fail', data: errors.array() });
   }

   // get only the validated data from the request
   const validData = matchedData(req);

   try {
       const updatedAlbum = await req.user.save(validData);
       debug("Updated user successfully: %O", updatedAlbum);

       res.send({
           status: 'success',
           data: {
               user: updatedAlbum,
           },
       });

   } catch (error) {
       res.status(500).send({
           status: 'error',
           message: 'Exception thrown in database when updating a new Album.',
       });
       throw error;
   }
}




// Get inlogged users Photos
const getPhotos = async (req, res) => {
   
    // lazyload
    await req.user.load('photos');

    res.status(200).send({
        status: 'success',
        data: {
            photos: req.user.related('photos'),
        },
    });
}

const addPhoto = async (req, res) => {
   // check for errors

   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(422).send({ status: 'fail', data: errors.array() });
   }

   // get only the validated data from the request
   const validData = matchedData(req);

   // fetch user and eager-load photos relation
   const user = await User.fetchById(req.user.user_id, { withRelated: ['photos'] });

   // get the user's photos
   const photos = user.related('photos');

   // check if photo is already in the user's list of photos
   const existing_photo = photos.find(photo => photo.id == validData.photo_id);

   // if photo already exists, error
   if (existing_photo) {
       return res.send({
           status: 'fail',
           data: 'That Photo already exists.',
       });
   }

   try {
       const result = await user.photos().attach(validData.photo_id);
       debug("Added photo to user successfully: %O", result);

       res.send({
           status: 'success',
           data: null,
       });

   } catch (error) {
       res.status(500).send({
           status: 'error',
           message: 'Exception thrown in database when adding a photo to a user.',
       });
       throw error;
   }
}

// update logged in users photos
const updatePhoto = async (req, res) => {
   // looking for validation errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(422).send({ status: 'fail', data: errors.array() });
   }

   // get only the validated data from the request
   const validData = matchedData(req);

   try {
       const updatedPhoto = await req.user.save(validData);
       debug("Updated photo successfully: %O", updatedPhoto);

       res.send({
           status: 'success',
           data: {
               user: updatedPhoto,
           },
       });

   } catch (error) {
       res.status(500).send({
           status: 'error',
           message: 'Exception thrown in database when updating a new Photo.',
       });
       throw error;
   }
}



//Add a photo to an album as a logged in user

const addPhotoToAlbum = async (req, res) => {
   // check for errors

   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(422).send({ status: 'fail', data: errors.array() });
   }
   // get only the validated data from the request
   const validData = matchedData(req);

   // fetch album and eager-load photos relation
   const album = await Album.fetchById(req.album.album_id, { withRelated: ['photos'] });

   // get the album's photos
   const photos = album.related('photos');

   // check if photo is already in the albums's list of photos
   const existing_photo = photos.find(photo => photo.id == validData.photo_id);

   // if photo already exists, error
   if (existing_photo) {
       return res.send({
           status: 'fail',
           data: 'The Photo already exists.',
       });
   }

   try {
       const result = await album.photos().attach(validData.photo_id);
       debug("Added photo to album successfully: %O", result);

       res.send({
           status: 'success',
           data: null,
       });

   } catch (error) {
       res.status(500).send({
           status: 'error',
           message: 'Exception thrown in database when adding a photo to an album.',
       });
       throw error;
   }
}

module.exports = {
    getProfile,
    updateProfile,
    getAlbums,
    addAlbum,
    updateAlbum,
    getPhotos,
    addPhoto,
    updatePhoto,
    addPhotoToAlbum
}
