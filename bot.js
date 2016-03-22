var tinder = require('tinderjs');
var auth = require('tinderauth');
var client = new tinder.TinderClient();
var _ = require('underscore');
var messageGenerator = require('./randmessageGenerator');
var randIntGenerator = require('./randRange').randIntInRange;
var args = process.argv.slice(2);

var exit = function() {
   process.exit();
};

var messageService = function(cb) {
   client.getHistory(function(err, data){
      var matches = data.matches;
      var msg = messageGenerator.getResponse();
      _.chain(matches)
         .filter(function(match) {
            return match.messages.length === 0;
         })
         .pluck('_id')
         .each(function(id) {
            client.sendMessage(id, msg, function() {
               console.log('initial message sent', msg);
            });
         });
    });
    if (cb) {
       cb();
    }
};

var likingService = function(){
   var defaults = client.getDefaults();
   var recs_size = defaults.globals.recs_size; 
   client.getRecommendations(recs_size, function(err, data) {
      console.log(data);
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
};

auth.default().then(function(res){
   var token = res.token;
   var profile_id = res.profile_id;
   client.authorize(token, profile_id, function() {
      console.log('authorized!');     
      
      if (!args[0]){
         (function msgLoop() {
            var messageInterval = randIntGenerator(60000, 120000);
            setTimeout(function(){
               messageService();
               msgLoop();
            }, messageInterval);
         }());
         (function likeLoop() {
            var likeInterval = randIntGenerator(5000, 20000);
            setTimeout(function() {
               likingService();
               likeLoop();
            }, likeInterval);
         }());
      } else if (args[0] === 'msg') {
         messageService(exit);
      } else {
         console.log('Unrecognized option - exiting');
         exit();
      }
   });
});
