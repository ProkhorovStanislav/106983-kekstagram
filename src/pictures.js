'use strict';

(function() {
  var pictures = null;
  window.loadPicturesCallback = function(data) {
    pictures = data;
    console.log(pictures);
  };

  function addScriptToMainPage(url, callback) {
    var scriptEl = document.createElement('script');
    scriptEl.src = url + '/?callback=' + callback;
    document.body.appendChild(scriptEl);
  }

  addScriptToMainPage('http://localhost:1506/api/pictures', 'loadPicturesCallback');

})();

