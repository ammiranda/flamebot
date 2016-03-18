var tinder = require('tinderjs');
var auth = require('tinderauth');
var client = new tinder.TinderClient();
var _ = require('underscore');

auth.default().then(function(res){
   var token = res.token;
   var profile_id = res.profile_id;
   client.authorize(token, profile_id, function() {
      console.log('authorized!');
      var defaults = client.getDefaults();
      var recs_size = defaults.globals.recs_size;      

      setInterval(function() {
         client.getRecommendations(recs_size, function(err, data) {
            console.log(data);
            _.chain(data.results)
               .pluck('_id')
               .each(function(id) {
                  console.log(id);
                  client.like(id, function(err, data) {
                     console.log(data);
                     if (!_.isNull(data) && data.match) {
                        client.sendMessage(id, "Do you like avocados?", function(){
                           console.log('msg sent');
                        });
                     }
                  });
                });
            });
      }, 5000);
   });
});
