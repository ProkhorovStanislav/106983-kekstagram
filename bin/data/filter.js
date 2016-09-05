'use strict';

module.exports = function(list, filterID) {
  var filteredList = [];
  switch (filterID) {
    case 'new':
      filteredList = list.filter(function(item) {
        var threeDaysAgoDate = new Date();
        threeDaysAgoDate.setDate(threeDaysAgoDate.getDate() - 3);
        return item['created'] >  threeDaysAgoDate.valueOf();
      }).sort(function(a, b) {
          return b['created'] - a['created'];
      });
      break;

    case 'discussed':
      filteredList = list.sort(function(a, b) {
          return b['comments'] - a['comments'];
        });
      break;

    default:
      filteredList = list.sort(function(a, b) {
          return b['likes'] - a['likes'];
        });
      break;
  }
  return filteredList;
};
