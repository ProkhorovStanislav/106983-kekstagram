'use strict';

var gallery = require('./gallery.js');
var elementToClone;
var templateElement = document.querySelector('template');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var Picture = function(response, index, lastIndex) {
  this.element = elementToClone.cloneNode(true);
  this.data = response;
  this.index = lastIndex + index;

  this.setup();
  this.load();
};

Picture.prototype.setup = function() {
  var pictureLikes = this.element.querySelector('.picture-likes');
  var pictureComments = this.element.querySelector('.picture-comments');
  var that = this;

  this.element.onclick = function(event) {
    event.preventDefault();
    gallery.show(that.index);
  };

  pictureLikes.textContent = this.data.likes;
  pictureComments.textContent = this.data.comments;
};

Picture.prototype.load = function() {
  var newImage = new Image();
  var image = this.element.querySelector('img');
  var that = this;

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

Picture.prototype.remove = function() {
  this.element.onclick = null;
};

module.exports = Picture;
