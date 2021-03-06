'use strict';

function getMessage(a, b) {
  var message = 'Функции были переданы некорректные значения';
  
  if (typeof a === 'boolean') {
    if (a) {
      message = 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      message = 'Переданное GIF-изображение не анимировано';
    }
  }  
  
  if (typeof a === 'number') {
    message = 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' атрибутов';
  } 

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      var artifactsSquare = 0;
      for (var i = 0; i < a.length; i++) {
        artifactsSquare += a[i] * b[i];
      }
      message = 'Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей';
    } else {
      var amountOfRedPoints = 0;
      for (i = 0; i < a.length; i++) {
        amountOfRedPoints += a[i];
      }
      message = 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints;
    }
  }

  return message;
}
