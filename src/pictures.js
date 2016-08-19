'use strict';

// (function() {
//
//   function addScriptToMainPage(url, callbackFunction) {
//     var scriptEl = document.createElement('script');
//     scriptEl.src = url + '/?callback=' + callbackFunction;
//     document.body.appendChild(scriptEl);
//   }
//
//   addScriptToMainPage('http://localhost:1506/api/pictures', 'loadPicturesCallback');
//   console.log(addScriptToMainPage('http://localhost:1506/api/pictures', 'loadPicturesCallback'));
// })();

(function() {

  function addScriptToMainPage(url, callback) {
    var scriptEl = document.createElement('script');
    scriptEl.src = url + '/?callback=' + callback;
    document.body.appendChild(scriptEl);
  }

  addScriptToMainPage('http://localhost:1506/api/pictures', 'loadPicturesCallback' );

})();

/**
 Создайте функцию, с помощью которой можно будет выполнять JSONP запросы.
 Функция должна принимать два параметра: один из которых — адрес запроса и второй параметр — функция,
 которая должна вызываться после выполнения JSONP скрипта. Функция, которая была передана вторым параметром,
 должна иметь единственный аргумент: набор данных, который возвращает JSONP-скрипт.*/
