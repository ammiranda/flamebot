var tinder = require('tinderjs');
var auth = require('tinderauth');
var client = new tinder.TinderClient();
var _ = require('underscore');
var messageGenerator = require('./randmessageGenerator');
var args = process.argv.slice(2);

var exit = function() {
   process.exit();
};

var messageService = function(cb) {
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
         }
       }
       if (cb) {
          cb();
       }
    });
};

auth.default().then(function(res){
   var token = res.token;
   var profile_id = res.profile_id;
   client.authorize(token, profile_id, function() {
      console.log('authorized!');
      var defaults = client.getDefaults();
      var recs_size = defaults.globals.recs_size;      
      
      if (!args[0]){

      setInterval(messageService, 120000);      
      
      setInterval(function() {
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
      }, 5000);

      } else if (args[0] === 'msg') {
         messageService(exit);
      }
   });
});
