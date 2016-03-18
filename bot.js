var tinder = require('tinderjs');
var auth = require('tinderauth');
var client = new tinder.TinderClient();
var _ = require('underscore');
var fs = require('fs');
var messageGenerator = require('./randmessageGenerator');

auth.default().then(function(res){
   var token = res.token;
   var profile_id = res.profile_id;
   client.authorize(token, profile_id, function() {
      console.log('authorized!');
      var defaults = client.getDefaults();
      var recs_size = defaults.globals.recs_size;      
      
      setInterval(function() {
         client.getHistory(function(err, data){
            var matches = data.matches;
            for (var i = matches.length - 1; i > 0; --i) {
                var match = matches[i];
                var id = match['_id'];
                if (match.messages.length === 0) {
                   var msg = messageGenerator.getResponse();
                   client.sendMessage(id, msg, function() {
                      console.log('initial message sent', msg);
                   });
                } else {
                   console.log('already sent initial message');
                }
             }
         });
      }, 120000);      
      
      setInterval(function() {
         client.getRecommendations(recs_size, function(err, data) {
            _.chain(data.results)
               .pluck('_id')
               .each(function(id) {
                  client.like(id, function(err, data) {
                     if (!err) {
                        console.log('user liked');
                     }
                  });
                });
            });
      }, 5000);
   });
});
