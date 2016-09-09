'use strict';

var load = function(url, options, callback) {
  var xhr = new XMLHttpRequest();
  var param = '?from=' + options.from + '&to=' + options.to + '&filter=' + options.filter;

  xhr.open('GET', url + param, true);

  xhr.onload = function() {
    try {
      var jsonData = JSON.parse(xhr.responseText);
      callback(jsonData);
    } catch(e) {
      console.warn('JSON parse error!');
    }

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
