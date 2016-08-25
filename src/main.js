'use strict';

require('./upload-stat.min');
require('./upload')();
require('./resizer')();

var getPictureElement = require('./pictures');
var load = require('./load');
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
