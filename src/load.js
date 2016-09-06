'use strict';

var load = function(url, options, callback) {
  var xhr = new XMLHttpRequest();
  var param = '?from=' + options.from + '&to=' + options.to + '&filter=' + options.filter;
  var filtersBlock = document.querySelector('.filters');

  xhr.open('GET', url + param, true);

  xhr.onload = function() {
    var jsonData = JSON.parse(xhr.responseText);
    callback(jsonData);
    filtersBlock.classList.remove('hidden');
  };

  xhr.onerror = function() {
    console.warn('Data has not been loaded');
  };

  xhr.timeout = 0;
  xhr.ontimeout = function() {
    console.warn('Response from the server was not received');
  };

  xhr.send();
};

module.exports = load;
