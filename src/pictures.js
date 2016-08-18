'use strict';

var pictures = null;
var loadPicturesCallback = function(data) {
  pictures = data;
};

var scriptEl = document.createElement('script');
scriptEl.src = 'data.js';
document.body.appendChild(scriptEl);


//var address = 'http://localhost:1506/api/pictures?callback=<название JSONP-коллбэка>';

/**
 Создайте функцию, с помощью которой можно будет выполнять JSONP запросы.
 Функция должна принимать два параметра: один из которых — адрес запроса и второй параметр — функция,
 которая должна вызываться после выполнения JSONP скрипта. Функция, которая была передана вторым параметром,
 должна иметь единственный аргумент: набор данных, который возвращает JSONP-скрипт.*/
