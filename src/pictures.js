'use strict';

(function() {
  var pictures = [];
  var picturesBlock = document.querySelector('.pictures');
  var templateElement = document.querySelector('template');
  var IMAGE_LOAD_TIMEOUT = 10000;
  var elementToClone;
  var filtersBlock = document.querySelector('.filters');

  filtersBlock.classList.add('hidden');

  addScriptToMainPage('http://localhost:1506/api/pictures', 'loadPicturesCallback');

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  window.loadPicturesCallback = function(response) {
    pictures = response;
    pictures.forEach(function(picture) {
      getPictureElement(picture, picturesBlock);
    });
  };

  function addScriptToMainPage(url, callback) {
    var scriptEl = document.createElement('script');
    scriptEl.src = url + '/?callback=' + callback;
    document.body.appendChild(scriptEl);
  }

  function getPictureElement(response, container) {
    var element = elementToClone.cloneNode(true);
    var newImage = new Image();
    var image = element.querySelector('img');
    var imageLoadTimeout;

    container.appendChild(element);
    element.querySelector('.picture-comments').textContent = response.likes;
    element.querySelector('.picture-likes').textContent = response.comments;
    newImage.src = response.url;

    newImage.onload = function(evt) {
      clearTimeout(imageLoadTimeout);
      image.width = '182';
      image.height = '182';
      image.src = evt.target.src;
    };

    newImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    return element;
  }

})();

