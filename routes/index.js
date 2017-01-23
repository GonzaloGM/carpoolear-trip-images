'use strict';

const express    = require('express');
const router     = express.Router();
const images     = require('../controllers/images.js');
const mockupJSON = require('../controllers/mockupJSON.js');

module.exports = function (app) {
  // IMAGES
  router.get('/generateimg', images.generateImage);
  router.get('/image', images.getImageByID);

  // MOCKUP JSON
  router.get('/tripsjson', mockupJSON.getTripsJSON);

  // static page to load image by AJAX
  router.get('/', (req, res, next) => res.render('index'));

  return router;
};
