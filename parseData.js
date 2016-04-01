var _ = require('underscore');
var rawData = require(__dirname + '/userData.json');
var obj = {};

_.chain(rawData.matches)
   .each(function(match){
      var key = match.last_activity_date.substr(0,7);
      if (obj[key]) {
         obj[key] += 1;
      } else {
         obj[key] = 1;
      }
   });

console.log(obj);

