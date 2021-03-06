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

  Gallery.prototype.addPictures = function(pictures) {
    var pics = this.pictures;
    pictures.forEach(function(item) {
      pics.push(item);
    });
  };

  Gallery.prototype.show = function(index) {

    this.galleryOverlayClose.onclick = this.hide.bind(this);

    this.galleryOverlay.onclick = function() {
      var indexNext = this.activePicture + 1;
      if (indexNext >= this.pictures.length) {
        indexNext = 0;
      }
      this.setActivePicture(indexNext);
    }.bind(this);

    this.galleryOverlay.classList.remove('invisible');
    this.setActivePicture(index);
  };

  Gallery.prototype.hide = function() {
    this.galleryOverlay.classList.add('invisible');
    this.galleryOverlayClose.onclick = null;
    this.galleryOverlay.onclick = null;
  };

  Gallery.prototype.setActivePicture = function(index) {
    this.activePicture = index;
    var currentPicture = this.pictures[this.activePicture];
    this.galleryOverlayImage.src = currentPicture.url;
    this.galleryOverlayLikes.textContent = currentPicture.likes;
    this.galleryOverlayComments.textContent = currentPicture.comments;
  };

  module.exports = new Gallery();
})();

