# Carpoolear Trip Images

A Node.js example of working with GraphicsMagick (or ImageMagick) to generate a list of images with data loaded from a JSON file (an external API for example).

It also includes a static page that triggers the image generation and then asynchronously loads it with AJAX (with a retryer in case the image takes too long to generate).

Originally created for [Carpoolear](http://www.carpoolear.com.ar), a free carpooling app created by [STS Rosario](http://www.stsrosario.org.ar), an NGO from Rosario, Argentina.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

#### GhostScript
You will need to [download and install Ghostscript](http://ghostscript.com/download/gsdnld.html) and you have to [install GraphicsMagick binaries](http://www.graphicsmagick.org/download.html). Here's the [GraphicsMagick Windows binaries](https://sourceforge.net/projects/graphicsmagick/files/graphicsmagick-binaries/).

Then, install the GraphicsMagick package globally, and afterwards, install the project dependencies:

```
npm install -g gm
npm install
```

NOTE: after installing GhostScript you may need to reinstall GraphicsMagick if you already had installed it.

#### Common Issues with Ghostscript
If you get this error:

`Command failed: gm convert: Unable to read font (n019003l.pfb) [No such file or directory].`

you can try going to your Ghostscript installation folder (i.e., C:\Program Files\gs\gs9.20), and adding [this fonts folder](https://sourceforge.net/projects/gs-fonts/).

### Running

```
nodemon npm start
```

And open the following URL on your browser: [http://localhost:3000/](http://localhost:3000/)

## Deployment

### Heroku

Heroku needs a little tweaking to work with GraphicsMagick, you'll need to add a buildpack. Click the following link to [use GraphicsMagick in Heroku](https://github.com/mcollina/heroku-buildpack-graphicsmagick).

### ImageMagick
If you need to, here's [how to use ImageMagick with gm on Node.js](http://aheckmann.github.io/gm/docs.html#imagemagick).

## Built With

* [Express](http://expressjs.com/) - The framework used
* [gm](http://aheckmann.github.io/gm/) - GraphicsMagick (or ImageMagick) for Node.js

## Authors

* **Gonzalo González Mora** - *Initial work* - [GonzaloGM](https://github.com/GonzaloGM)

See also the list of [contributors](https://github.com/GonzaloGM/carpoolear-trip-images/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [@pasimako's Guide to GraphicsMagick on Node.js](https://ubuverse.com/using-graphicsmagick-for-image-manipulation-in-node-js/)
* [AJAX Retryer from Carolyn Lee (in StackOverflow)](http://stackoverflow.com/a/38903810/2122042)