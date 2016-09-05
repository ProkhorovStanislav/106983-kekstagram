'use strict';

(function() {
  var Picture = require('./picture');
  var gallery = require('./gallery');
  var load = require('./load');
  var pictures = [];
  var picturesContainer = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.filters');
  var pageNumber = 0;
  var PAGESIZE = 12;
  var dataUrl = 'http://localhost:1506/api/pictures';

  var loadPicturesNextPage = function() {
    pageNumber = pageNumber + 1;
    load(dataUrl, {from: pageNumber * PAGESIZE, to: pageNumber * PAGESIZE + PAGESIZE}, loadPicturesCallback);
  };

  var isBottomReached = function() {
    var lastImage = picturesContainer.querySelector('.picture:last-child');
    var positionImage = lastImage.getBoundingClientRect();
    return positionImage.top - window.innerHeight - 100 <= 0;
  };

  var picturesChange = function() {

    if (isBottomReached()) {
      setTimeout(loadPicturesNextPage, 300);
    }
  };

  var loadPicturesCallback = function(response) {
    pictures = response;
    if (pageNumber === 0) {
      picturesContainer.innerHTML = '';
    }
    if (pictures.length === 0 || pictures.length < PAGESIZE) {
      window.addEventListener('scroll', picturesChange);
    }
    pictures.forEach(function(picture, index) {
      var createPicture = new Picture(picture, index);
      picturesContainer.appendChild(createPicture.element);
    });
    gallery.setPictures(pictures);
  };

  filtersBlock.classList.remove('hidden');
  load(dataUrl, {from: 0, to: PAGESIZE }, loadPicturesCallback);
  filtersBlock.addEventListener('change', function(evt) {
    window.addEventListener('scroll', picturesChange);
    if (event.target.tagName.toLowerCase() === 'input') {
      pageNumber = 0;
      var elementValue = evt.target.value;
      load(dataUrl, {from: 0, to: PAGESIZE, filter: elementValue}, loadPicturesCallback);
    }
  }, true);

  window.addEventListener('scroll', picturesChange);
})();
