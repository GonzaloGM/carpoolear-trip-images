'use strict';

const async   = require('async');
const fs      = require('fs');
const moment  = require('moment');
const os      = require('os');
const path    = require('path');
const request = require('request');
const uuid    = require('uuid');
const gm      = require('gm');

// WARNING:
// To use GraphicsMagick on Heroku you'll need this:
// https://github.com/mcollina/heroku-buildpack-graphicsmagick

// set moment locale to Spanish
moment.locale('es');

// returns an image from /tmp by its ID
exports.getImageByID = function (req, res, next) {
  const id = req.query.id;
  const imagePath = path.join(os.tmpdir(), '/', id + '.png');
  const img = fs.readFileSync(imagePath);
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(img, 'binary');
}

// generates image from trips data using GraphicsMagick,
// returns JSON with future path to image (to load via AJAX)
exports.generateImage = function (req, res, next) {
  const hostname = (process.env.NODE_ENV === 'production') ? 'http://carpoolear-trip-images.herokuapp.com' : 'http://localhost:3000';
  const JSONURL = `${hostname}/tripsjson`;

  request({
    'url': JSONURL,
    'json': true
  }, function (error, response, body) {
    // if we get trips data, return future path of generated image to load it
    // with AJAX from frontend, and we start generating the image
    if (!error && response.statusCode === 200) {
      const randomString = uuid.v4();
      const tmpFinalImagePath = path.join(os.tmpdir(), '/', randomString) + '.png';

      res.json({ 'imgURL': `${hostname}/image?id=${randomString}` });

      let json = [];
      for (let property in body) {
        if (body.hasOwnProperty(property)) {
          json.push(body[property]);
        }
      }

      // TEMPORARY FOR TESTING: generates only 1 image
      json = json.slice(0, 1);

      // array with individual trip images
      let tripsImagePaths = [];
      const abelRegularPath       = 'typefaces/Abel-Regular.ttf';
      const montserratRegularPath = 'typefaces/Montserrat-Regular.ttf';
      const montserratBoldPath    = 'typefaces/Montserrat-Bold.ttf';

      async.eachSeries(json, function (trip, callbackEach) {
        // generate temporary file path for profile pic images
        const tmpProfilePicPath = path.join(os.tmpdir(), '/', uuid.v4()) + '.png';

        // download profile pic from Facebook, save to tmp dir and add to trips array
        gm(request('http://graph.facebook.com/' + trip.user_id + '/picture?type=square&height=100&width=100'))
        .write(tmpProfilePicPath, function (err) {
          if (err) {
            console.log('error writing image', err);
            callbackEach(err);
          } else {
            trip.avatar_path = tmpProfilePicPath;
            console.log('successfully wrote image to tmp');

            const profilePicSize = 60;
            const profilePicX    = 18;
            const profilePicY    = 165;
            let seatsText;
            let seatsTextColor;
            let backgroundImageName;
            let tripPrivacyText;
            let tripPrivacyTextX;
            let tripPrivacyTextY;
            let tripPrivacyImageName;
            let tripPrivacyImageX;
            let tripPrivacyImageY;
            let tripPrivacyImageWidth;
            let tripPrivacyImageHeight;

            // toggle background image according to number of seats
            if (trip.asientos_disponibles === 1) {
              seatsText = '1 ASIENTO LIBRE';
              seatsTextColor = '#fe0000';
              backgroundImageName = 'fondo_1_asiento.png';
            } else {
              seatsText = trip.asientos_disponibles + ' ASIENTOS LIBRES';
              seatsTextColor = '#2b592b';
              backgroundImageName = 'fondo_varios_asientos.png';
            }

            // toggle position and text according to trip privacy (not needed actually,
            // we only show public trips for now, but made for future use)

            switch (trip.friendship_type_id) {
              case 0:
                tripPrivacyText = 'VIAJE \nDE AMIGOS';
                tripPrivacyTextX = 485;
                tripPrivacyTextY = 195;
                tripPrivacyImageName = 'img/viaje_amigos.png';
                tripPrivacyImageX = 422;
                tripPrivacyImageY = 167;
                tripPrivacyImageWidth = 48;
                tripPrivacyImageHeight = 48;
                break;
              case 1:
                tripPrivacyText = 'VIAJE DE \nAMIGOS DE AMIGOS';
                tripPrivacyTextX = 455;
                tripPrivacyTextY = 195;
                tripPrivacyImageName = 'img/viaje_amigosdeamigos.png';
                tripPrivacyImageX = 385;
                tripPrivacyImageY = 180;
                tripPrivacyImageWidth = 58;
                tripPrivacyImageHeight = 37;
                break;
              case 2:
                tripPrivacyText = 'VIAJE \nPÚBLICO';
                tripPrivacyTextX = 485;
                tripPrivacyTextY = 195;
                tripPrivacyImageName = 'img/viaje_publico.png';
                tripPrivacyImageX = 422;
                tripPrivacyImageY = 172;
                tripPrivacyImageWidth = 52;
                tripPrivacyImageHeight = 52;
                break;
            }

            // create background image path
            const imagePath = path.join(__dirname, '/../img/', backgroundImageName);

            // avatar and privacy images parameters for draw command
            const avatarDraw = `image Over ${profilePicX}, ${profilePicY}, ${profilePicSize}, ${profilePicSize} ${trip.avatar_path}`;
            const privacyDraw = `image Over ${tripPrivacyImageX}, ${tripPrivacyImageY}, ${tripPrivacyImageWidth}, ${tripPrivacyImageHeight} ${tripPrivacyImageName}`;

            // generate random file path in /tmp for temporary trip images
            const tmpTripImgPath = path.join(os.tmpdir(), '/', uuid.v4()) + '.png';

            // resize text based on string length
            let textFromSize = 30;
            if (trip.from_town.length > 50) {
              textFromSize = 20;
            } else if (trip.from_town.length > 40) {
              textFromSize = 24;
            }

            let textToSize = 30;
            if (trip.to_town.length > 50) {
              textToSize = 20;
            } else if (trip.to_town.length > 40) {
              textToSize = 24;
            }

            // generate image from background and add text from trip data
            gm(imagePath)
            // origin and destination text
            .fill('#204157')
            .font(abelRegularPath, textFromSize)
            .drawText(18, 70, trip.from_town)
            .font(abelRegularPath, textToSize)
            .drawText(540, 70, trip.to_town)
            // driver name
            .font(abelRegularPath, 24)
            .drawText(95, 207, trip.name)
            // date and time text
            .fill('#ffffff')
            .font(abelRegularPath, 22)
            .drawText(18, 135, moment(trip.trip_date).format('DD MMMM YYYY').toUpperCase())
            .drawText(-35, 8, moment(trip.trip_date).format('dddd').toUpperCase(), 'Center')
            .drawText(162, 8, moment(trip.trip_date).format('H:mm[HS]').toUpperCase(), 'Center')
            // seats left text
            .fill(seatsTextColor)
            .font(montserratBoldPath, 20)
            .drawText(395, 43, seatsText, 'Center')
            // see trip text
            .fill('#ffffff')
            .drawText(395, 100, 'VER VIAJE', 'Center')
            // embed avatar
            .draw([avatarDraw])
            // embed privacy image
            .draw([privacyDraw])
            // privacy text
            .fill('#204157')
            .font(montserratRegularPath, 14)
            .drawText(tripPrivacyTextX, tripPrivacyTextY, tripPrivacyText)
            .write(tmpTripImgPath, function (err) {
              if (err) {
                console.log('ERROR writing image.');
                return next(err);
              }

              tripsImagePaths.push(tmpTripImgPath);
              callbackEach();
            });
          }
        });
      }, function (result) {
        // generate final image (with all public trips)
        let finalImage = gm();

        // append each image (saved in /tmp) to final image
        tripsImagePaths.forEach(function (img_path) {
          finalImage.append(img_path);
        });

        // save image in random path (previously generated and sent on
        // response for later loading with AJAX from frontend
        finalImage.write(tmpFinalImagePath, function (err) {
          if (err) {
            console.log('ERROR writing image.');
            return next(err);
          }
          console.log('Wrote image successfully');
        });
      });
    }
  });
};

// ---------- COLOURS ----------
// azul texto: #204157
// rojo texto asientos: #fe0000
// mostaza fondo asientos: #f7c23e
// rojo fondo ver viaje: #ce2528
// verde claro fondo asientos: #68d666
// verde oscuro fondo ver viaje: #2b592b
// verde oscuro texto asientos: #2b592b
