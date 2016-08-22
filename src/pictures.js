'use strict';

(function() {
  var pictures = null;
  var picturesBlock = document.querySelector('.pictures');
  var templateElement = document.querySelector('template');
  var filtersBlock = document.querySelector('.filters');
  var IMAGE_LOAD_TIMEOUT = 10000;
  var elementToClone;

  window.loadPicturesCallback = function(data) {
    pictures = data;
    pictures.forEach(function(picture) {
      getPictureElement(picture, picturesBlock);
    });

  };

  function addScriptToMainPage(url, callback) {
    var scriptEl = document.createElement('script');
    scriptEl.src = url + '/?callback=' + callback;
    document.body.appendChild(scriptEl);
  }

  addScriptToMainPage('http://localhost:1506/api/pictures', 'loadPicturesCallback');

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  filtersBlock.classList.add('hidden');

  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    container.appendChild(element);
    var newImage = new Image();
    var imageField = element.querySelector('img');
    var imageLoadTimeout;
    element.querySelector('.picture-comments').textContent = data.likes;
    element.querySelector('.picture-likes').textContent = data.comments;

    newImage.onload = function(evt) {
      clearTimeout(imageLoadTimeout);
      imageField.width = '182';
      imageField.height = '182';
      imageField.src = evt.target.src;
    };

    newImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    newImage.src = data.url;

    imageLoadTimeout = setTimeout(function() {
      imageField.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    return element;
  };

  filtersBlock.classList.remove('hidden');

})();

