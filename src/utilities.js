'use strict';

var utilities = {
  throttle: function(fn, wait) {
    var time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    };
  }
};

module.exports = utilities;
