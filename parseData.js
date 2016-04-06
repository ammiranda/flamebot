var _ = require('underscore');
var fs = require('fs');
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

var dataset = [];

for (var key in obj) {
   var point = {};
   var dateArr = key.split('-');
   point.date = new Date(dateArr[0], dateArr[1], 0);
   point.value = obj[key];
   dataset.push(point);
}

var stringJSON = JSON.stringify(dataset, null, '\t');

fs.writeFile(__dirname + '/d3dataset.json', stringJSON, 'utf8', function(err, data){});
