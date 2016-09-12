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
  var clientHeight = document.documentElement.clientHeight;
  var defaultFilter = 'filter-popular';
  var activeFilterKeyName = 'ActiveFilter';
  var activeFilter = localStorage.getItem(activeFilterKeyName);

  var loadPicturesNextPage = function() {
    pageNumber++;
    load(dataUrl, {from: pageNumber * PAGESIZE, to: pageNumber * PAGESIZE + PAGESIZE}, loadPicturesCallback);
  };

  var isBottomReached = function() {
    var lastImage = picturesContainer.querySelector('.picture:last-child');
    var positionImage = lastImage.getBoundingClientRect();
    return positionImage.top - clientHeight - 100 <= 0;
  };

  var picturesChange = function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (isBottomReached()) {
        loadPicturesNextPage();
      }
    }, 100);
  };

  var isNextPageAvailable = function(response) {
    return pageNumber < Math.floor(response.length / PAGESIZE);
  };

  var loadPicturesCallback = function(response) {

    response.forEach(function(picture) {
      var createPicture = new Picture(picture, pictureIndex);
      picturesContainer.appendChild(createPicture.element);
      pictureIndex++;
    });
    gallery.addPictures(response);

    if (isBottomReached() && isNextPageAvailable(response)) {

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
      localStorage.setItem(activeFilterKeyName, elementValue);
      load(dataUrl, {from: pageNumber, to: PAGESIZE, filter: elementValue}, loadPicturesCallback);
    }
  }, true);

  function toSetActiveFilter() {
    if (activeFilter !== null) {
      document.getElementById(activeFilter).checked = true;
    } else {
      document.getElementById(defaultFilter).checked = true;
    }
  }

  window.addEventListener('load', toSetActiveFilter);

  window.addEventListener('scroll', picturesChange);
})();
