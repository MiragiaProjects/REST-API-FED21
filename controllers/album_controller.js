/**
 * Album Controller
 */

 const debug = require('debug')('books:album_controller');
 const { matchedData, validationResult } = require('express-validator');
 const models = require('../models');
 
 /**
  * Get all albums from authenticated user
  */
 const index = async (req, res) => {
	 // Lazy load the album relation
	 await req.user.load('albums');
 
	 res.status(200).send({
		 status: 'success',
		 data: {
			 albums: req.user.related('albums'),
		 }
	 })
 }
 
 /**
  * Get authenticated users specific album with related photos
  */
 const show = async (req, res) => {
	 // Get user with all related albums
	 const user = await models.User.fetchById(req.user.id, { withRelated: ['albums'] });
	 const albumsUser = user.related('albums');
 
	 // Find album with requested id and check if it exists
	 const album = albumsUser.find(album => album.id == req.params.albumId);
	 if (!album) {
		 return res.status(404).send({
			 status: 'fail',
			 data: "Album could not be found",
		 });
	 }
 
	 // Get the requested album with related photos
	 const albumId = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos']});
 
	 res.status(200).send({
		 status: 'success',
		 data: albumId
	 });
 }
 
 /**
  * Create new album
  */
 const store = async (req, res) => {
	 // Check for validation errors
	 const errors = validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(422).send({
			 status: 'fail',
			 data: errors.array() });
	 }
 
	 // Get the validated data
	 const validData = matchedData(req);
	 
	 validData.user_id = req.user.id;
 
	 try {
		 const album = await new models.Album(validData).save();
		 debug('New album created: %O', album);
 
		 res.status(200).send({
			 status: 'success',
			 data: album
		 });
 
	 } catch (error) {
		 res.status(500).send({
			 status: 'error',
			 message: 'Exception thrown in database when creating a new album'
		 });
		 throw error;
	 }
 }
 
 /**
  * Update specific album
  */
 const update = async (req, res) => {
	 // Check for validation errors
	 const errors = validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(422).send({
			 status: 'fail',
			 data: errors.array() });
	 }
 
	 // Get the validated data
	 const validData = matchedData(req);
 
	 // Get user with all related albums
	 const user = await models.User.fetchById(req.user.id, { withRelated: ['albums'] });
	 const albumsUser = user.related('albums');
 
	 // Find album with requested id and check if it exists
	 const album = albumsUser.find(album => album.id == req.params.albumId);
	 if (!album) {
		 return res.status(404).send({
			 status: 'fail',
			 data: "Album could not be found",
		 });
	 }
 
	 try {
		 const updatedAlbum = await album.save(validData);
		 debug('Updated book successfully: %O', updatedAlbum);
 
		 res.status(200).send({
			 status: 'success',
			 data: updatedAlbum
		 });
 
	 } catch (error) {
		 res.status(500).send({
			 status: 'error',
			 message: 'Exception thrown in database when updating an album'
		 });
		 throw error;
	 }
 }
 
 const addPhotoToAlbum = async (req, res) => {
	
	 const errors = validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(422).send({
			 status: 'fail',
			 data: errors.array() });
	 }
 
	 const validData = matchedData(req);
	 
	 const user = await models.User.fetchById(req.user.id, { withRelated: ['albums', 'photos'] });
	 const albumsUser = user.related('albums').find(album => album.id == req.params.albumId);
	 const photosUser = user.related('photos').find(photo => photo.id == validData.photo_id);
 
	 const albums = await models.Album.fetchById(req.params.albumId, { withRelated: ['photos']});
	 const photosAlbum = albums.related('photos').find(photo => photo.id == validData.photo_id);
 
	 if (!albumsUser) {
		 return res.status(404).send({
			 status: 'fail',
			 data: "Album could not be found",
		 });
	 }
 
	 if (!photosUser) {
		 return res.status(404).send({
			 status: 'fail',
			 data: "photo could not be found",
		 });
	 }
 
	 if (photosAlbum) {
		 return res.status(409).send({
			 status: 'fail',
			 data: 'Photo already exists.',
		 });
	 }
 
	 try {
		 const result = await albums.photos().attach(validData.photo_id);
		 debug("Added photo to album successfully: %O", result);
 
		 res.status(200).send({
			 status: 'success',
			 data: null,
		 });
 
	 } catch (error) {
		 res.status(500).send({
			 status: 'Error',
			 message: 'Exception thrown in database when adding a photo to an album.',
		 });
		 throw error;
	 }
 }
 
 module.exports = {
	 index,
	 show,
	 store,
	 update,
	 addPhotoToAlbum
 }