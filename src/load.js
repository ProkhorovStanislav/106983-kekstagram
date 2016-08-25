'use strict';

module.exports = function addScriptToMainPage(url, callback) {
  var scriptEl = document.createElement('script');
  scriptEl.src = url + '/?callback=' + callback;
  document.body.appendChild(scriptEl);
};
