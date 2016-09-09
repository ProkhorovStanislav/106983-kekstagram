'use strict';

(function() {
  var Picture = require('./picture');
  var gallery = require('./gallery');
  var load = require('./load');
  var picturesContainer = document.querySelector('.pictures');
  var filtersBlock = document.querySelector('.filters');
  var pageNumber = 0;
  var PAGESIZE = 12;
  var pictureIndex = 0;
  var dataUrl = 'http://localhost:1506/api/pictures';
  var scrollTimeout;

  var loadPicturesNextPage = function() {
    pageNumber++;
    load(dataUrl, {from: pageNumber * PAGESIZE, to: pageNumber * PAGESIZE + PAGESIZE}, loadPicturesCallback);
  };

  var isBottomReached = function() {
    var lastImage = picturesContainer.querySelector('.picture:last-child');
    var positionImage = lastImage.getBoundingClientRect();
    return positionImage.top - document.documentElement.clientHeight - 100 <= 0;
  };

  var picturesChange = function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (isBottomReached()) {
        loadPicturesNextPage();
      }
    }, 100);
  };

  var loadPicturesCallback = function(response) {

    response.forEach(function(picture) {
      var createPicture = new Picture(picture, pictureIndex);
      picturesContainer.appendChild(createPicture.element);
      pictureIndex++;
    });
    gallery.addPictures(response);

    if (picturesContainer.querySelector('.picture:last-child').getBoundingClientRect().bottom <= document.documentElement.clientHeight + 200) {
      loadPicturesNextPage();
    }

    filtersBlock.classList.remove('hidden');
  };

  load(dataUrl, {from: pageNumber, to: PAGESIZE}, loadPicturesCallback);

  filtersBlock.addEventListener('change', function(evt) {
    if (event.target.tagName.toLowerCase() === 'input') {
      while (picturesContainer.firstChild) {
        picturesContainer.removeChild(picturesContainer.firstChild);
      }
      pageNumber = 0;
      pictureIndex = 0;
      gallery.pictures = [];
      var elementValue = evt.target.id;
      load(dataUrl, {from: pageNumber, to: PAGESIZE, filter: elementValue}, loadPicturesCallback);
    }
  }, true);

  window.addEventListener('scroll', picturesChange);
})();
