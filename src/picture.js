'use strict';

(function() {
  var gallery = require('./gallery.js');

  var elementToClone;
  var templateElement = document.querySelector('template');

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  module.exports = function getPictureElement(response, container, index) {

    var element = elementToClone.cloneNode(true);

    container.appendChild(element);
    element.querySelector('.picture-comments').textContent = response.likes;
    element.querySelector('.picture-likes').textContent = response.comments;

    var newImage = new Image();
    var image = element.querySelector('img');
    var imageLoadTimeout;
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

    var IMAGE_LOAD_TIMEOUT = 10000;

    imageLoadTimeout = setTimeout(function() {
      image.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    element.addEventListener('click', function(event) {
      event.preventDefault();
      gallery.show(index);
    });

    return element;
  };
})();
