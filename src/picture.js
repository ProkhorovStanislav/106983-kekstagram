'use strict';

var gallery = require('./gallery.js');

var elementToClone;
var templateElement = document.querySelector('template');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var Picture = function(response, container, index) {
  var that = this;
  that.element = elementToClone.cloneNode(true);
  that.data = response;
  var pictureLikes = that.element.querySelector('.picture-likes');
  var pictureComments = that.element.querySelector('.picture-comments');

  pictureLikes.textContent = that.data.likes;
  pictureComments.textContent = that.data.comments;

  var image = that.element.querySelector('img');
  var newImage = new Image();
  newImage.src = that.data.url;

  newImage.onload = function(evt) {
    clearTimeout(that.imageLoadTimeout);
    image.width = '182';
    image.height = '182';
    image.src = evt.target.src;
  };

  newImage.onerror = function() {
    that.element.classList.add('picture-load-failure');
  };

  var IMAGE_LOAD_TIMEOUT = 10000;

  that.imageLoadTimeout = setTimeout(function() {
    image.src = '';
    that.element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  that.element.onclick = function(event) {
    event.preventDefault();
    gallery.show(index);
  };

  Picture.prototype.remove = function() {
    that.element.onclick = null;
  };
};

module.exports = Picture;
