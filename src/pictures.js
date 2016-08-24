'use strict';
var load = require('./load');
var getPictureElement = require('./review.js');

module.exports = function() {
  var pictures = [];
  var picturesBlock = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.filters');

  filtersBlock.classList.add('hidden');

  load('http://localhost:1506/api/pictures', 'loadPicturesCallback');

  window.loadPicturesCallback = function(response) {
    pictures = response;
    pictures.forEach(function(picture) {
      getPictureElement(picture, picturesBlock);
    });
  };
};

