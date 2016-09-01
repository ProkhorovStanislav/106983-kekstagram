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
  this.data = response;
  var pictureLikes = this.element.querySelector('.picture-likes');
  var pictureComments = this.element.querySelector('.picture-comments');

  pictureLikes.textContent = this.data.likes;
  pictureComments.textContent = this.data.comments;

  var image = this.element.querySelector('img');

  this.load = function() {
    var newImage = new Image();
    newImage.src = that.data.url;

    newImage.onload = function(evt) {
      clearTimeout(imageLoadTimeout);
      image.width = '182';
      image.height = '182';
      image.src = evt.target.src;
    };

    newImage.onerror = function() {
      that.element.classList.add('picture-load-failure');
    };

    var IMAGE_LOAD_TIMEOUT = 10000;

    var imageLoadTimeout = setTimeout(function() {
      image.src = '';
      that.element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    that.element.onclick = function(event) {
      event.preventDefault();
      gallery.show(index);
    };
  };

  this.load();

  Picture.prototype.remove = function() {
    that.element.onclick = null;
  };
};

module.exports = Picture;
