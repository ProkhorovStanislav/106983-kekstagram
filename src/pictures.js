'use strict';

(function() {
  var Picture = require('./picture');
  var gallery = require('./gallery');
  var load = require('./load');
  var picturesContainer = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.filters');
  var pageNumber = 0;
  var PAGESIZE = 12;
  var dataUrl = 'http://localhost:1506/api/pictures';
  var scrollTimeout;

  var loadPicturesNextPage = function() {
    load(dataUrl, {from: pageNumber * PAGESIZE, to: pageNumber * PAGESIZE + PAGESIZE}, loadPicturesCallback);
  };

  var isBottomReached = function() {
    var lastImage = picturesContainer.querySelector('.picture:last-child');
    var positionImage = lastImage.getBoundingClientRect();
    return positionImage.top - document.documentElement.clientHeight - 100 <= 0;
  };

  var picturesChange = function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function(){
      if (isBottomReached()) {
        pageNumber += 1;
        loadPicturesNextPage(pageNumber);
      }
    }, 100)
  };

  var loadPicturesCallback = function(response) {
    if (pageNumber === 0) {
      picturesContainer.innerHTML = '';
    }

    response.forEach(function(picture, index) {
      var createPicture = new Picture(picture, index);
      picturesContainer.appendChild(createPicture.element);
    });

    gallery.setPictures(response);
  };

  load(dataUrl, {from: pageNumber, to: PAGESIZE}, loadPicturesCallback);

  filtersBlock.addEventListener('change', function(evt) {
    if (event.target.tagName.toLowerCase() === 'input') {
      pageNumber = 0;
      var elementValue = evt.target.value;
      load(dataUrl, {from: pageNumber, to: PAGESIZE, filter: elementValue}, loadPicturesCallback);
    }
  }, true);

  window.addEventListener('scroll', picturesChange);
})();
