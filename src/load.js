'use strict';

var load = function(url, options, callback) {
  var xhr = new XMLHttpRequest();
  var param = '?from=' + options.from + '&to=' + options.to + '&filter=' + options.filter;
  xhr.open('GET', url + param, true);
  xhr.onload = function() {
    var jsonData = JSON.parse(xhr.responseText);
    callback(jsonData);

  };

  xhr.send();
};

module.exports = load;
