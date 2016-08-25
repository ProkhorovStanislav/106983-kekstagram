'use strict';

function getPictureElement(response, container) {
  var elementToClone;
  var templateElement = document.querySelector('template');
  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }
  var IMAGE_LOAD_TIMEOUT = 10000;
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

  imageLoadTimeout = setTimeout(function() {
    image.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  return element;
}

module.exports = getPictureElement;
