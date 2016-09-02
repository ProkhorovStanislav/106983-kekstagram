'use strict';

var gallery = require('./gallery.js');
var elementToClone;
var templateElement = document.querySelector('template');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var Picture = function(response, index) {
  var that = this;
  this.element = elementToClone.cloneNode(true);
  var image = this.element.querySelector('img');

  this.setup(response);
  this.load(image, that);

  that.element.onclick = function(event) {
    event.preventDefault();
    gallery.show(index);
  };

  Picture.prototype.remove = function() {
    that.element.onclick = null;
  };
};

Picture.prototype = {};

Picture.prototype.setup = function(response) {
  this.data = response;
  var pictureLikes = this.element.querySelector('.picture-likes');
  var pictureComments = this.element.querySelector('.picture-comments');

  pictureLikes.textContent = this.data.likes;
  pictureComments.textContent = this.data.comments;
};

Picture.prototype.load = function(image, that) {
  var newImage = new Image();

  newImage.onload = function(evt) {
    clearTimeout(imageLoadTimeout);
    image.width = '182';
    image.height = '182';
    image.src = evt.target.src;
  };

  newImage.onerror = function() {
    that.element.classList.add('picture-load-failure');
  };

  newImage.src = this.data.url;

  var IMAGE_LOAD_TIMEOUT = 10000;

  var imageLoadTimeout = setTimeout(function() {
    image.src = '';
    that.element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
};

module.exports = Picture;
