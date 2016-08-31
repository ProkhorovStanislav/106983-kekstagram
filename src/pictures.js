'use strict';

(function() {
  var Picture = require('./picture');
  var gallery = require('./gallery');
  var load = require('./load');
  var pictures = [];
  var picturesBlock = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.filters');

  filtersBlock.classList.add('hidden');

  load('http://localhost:1506/api/pictures', 'loadPicturesCallback');

  window.loadPicturesCallback = function(response) {
    pictures = response;
    pictures.forEach(function(picture, index) {
      var newPicture = new Picture(picture, picturesBlock, index);
      picturesBlock.appendChild(newPicture.element);
    });
    gallery.setPictures(pictures);
  };
})();
