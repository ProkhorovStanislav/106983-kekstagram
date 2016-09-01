'use strict';

(function() {
  var Picture = require('./picture');
  var gallery = require('./gallery');
  var load = require('./load');
  var pictures = [];
  var picturesContainer = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.filters');

  filtersBlock.classList.add('hidden');

  load('http://localhost:1506/api/pictures', 'loadPicturesCallback');

  window.loadPicturesCallback = function(response) {
    pictures = response;
    pictures.forEach(function(picture, index) {
      var createPicture = new Picture(picture, index);
      picturesContainer.appendChild(createPicture.element);
    });
    gallery.setPictures(pictures);
  };
})();
