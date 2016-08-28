'use strict';

(function() {
  var Gallery = function() {
    this.pictures = [];
    this.activePicture = null;
    this.galleryOverlay = document.querySelector('.gallery-overlay');
    this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
    this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
    this.galleryOverlayLikes = document.querySelector('.likes-count');
    this.galleryOverlayComments = document.querySelector('.comments-count');
  };

  Gallery.prototype = {};

  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  Gallery.prototype.show = function(pictureNumber) {
    var that = this;

    this.galleryOverlayClose.onclick = function() {
      that.hide();
    };

    this.galleryOverlay.onclick = function() {
      that.setActivePicture(that.activePicture + 1);
    };

    this.galleryOverlay.classList.remove('invisible');
    that.setActivePicture(pictureNumber);
  };

  Gallery.prototype.hide = function() {
    this.galleryOverlay.classList.add('invisible');
    this.galleryOverlayClose.onclick = null;
    this.galleryOverlay.onclick = null;
  };

  Gallery.prototype.setActivePicture = function(pictureNumber) {
    if (pictureNumber > this.pictures.length - 1) {
      pictureNumber = 0;
    }

    this.activePicture = pictureNumber;
    this.galleryOverlayImage.src = this.pictures[this.activePicture].url;
    this.galleryOverlayLikes.textContent = this.pictures[this.activePicture].likes;
    this.galleryOverlayComments.textContent = this.pictures[this.activePicture].comments;
  };

  module.exports = new Gallery();
})();

