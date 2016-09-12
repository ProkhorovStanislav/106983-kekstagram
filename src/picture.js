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
  this.element = elementToClone.cloneNode(true);
  this.data = response;
  this.index = index;

  this.setup();
  this.load();
};

Picture.prototype.setup = function() {
  var pictureLikes = this.element.querySelector('.picture-likes');
  var pictureComments = this.element.querySelector('.picture-comments');

  this.element.onclick = function(event) {
    event.preventDefault();
    gallery.show(this.index);
  }.bind(this);

  pictureLikes.textContent = this.data.likes;
  pictureComments.textContent = this.data.comments;
};

Picture.prototype.load = function() {
  var newImage = new Image();
  var image = this.element.querySelector('img');

  newImage.onload = function(evt) {
    clearTimeout(imageLoadTimeout);
    image.width = '182';
    image.height = '182';
    image.src = evt.target.src;
  };

  newImage.onerror = function() {
    this.element.classList.add('picture-load-failure');
  }.bind(this);

  newImage.src = this.data.url;

  var IMAGE_LOAD_TIMEOUT = 10000;

  var imageLoadTimeout = setTimeout(function() {
    image.src = '';
    this.element.classList.add('picture-load-failure');
  }.bind(this), IMAGE_LOAD_TIMEOUT);
};

Picture.prototype.remove = function() {
  this.element.onclick = null;
};

module.exports = Picture;
