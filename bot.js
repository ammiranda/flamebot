var tinder = require('tinderjs');
var auth = require('tinderauth');
var client = new tinder.TinderClient();
var _ = require('underscore');
var fs = require('fs');
var messageGenerator = require(__dirname + '/randmessageGenerator');
var randIntGenerator = require(__dirname + '/randRange').randIntInRange;
var args = process.argv.slice(2);
var winston = require('winston');
var logger = new (winston.Logger)({
   transports: [
      new (winston.transports.File)({ filename: __dirname + '/runtimes.log' })
   ]
});

logger.log('info', 'pid: ' + process.pid);

var exit = function() {
   process.exit();
};

var messageService = function(cb) {
   var totalMatches = 0;
   client.getHistory(function(err, data){
      var hist = JSON.stringify(data, null, '\t');
      fs.writeFile(__dirname + '/userData.json', hist, 'utf8', function(err, data) { if (err) console.log(err); }); 
      var matches = data.matches;
      var msg = messageGenerator.getResponse();
      _.chain(matches)
         .filter(function(match) {
            return match.messages.length === 0;
         })
         .pluck('_id')
         .each(function(id) {
            totalMatches++;
            client.sendMessage(id, msg, function() {
               console.log('initial message sent', msg);
            });
         });
       if (cb) {
  //        setTimeout(cb, 5000 * totalMatches);
       }
    });
};

var likingService = function(){
   var defaults = client.getDefaults();
   var recs_size = defaults.globals.recs_size; 
   client.getRecommendations(recs_size, function(err, data) {
      if (data.message && data.message.indexOf('timeout') > -1) {
         exit();
      }
      _.chain(data.results)
         .pluck('_id')
         .each(function(id) {
            client.like(id, function(err, data) {
               if (!err) {
                  console.log('user liked', data);
               }
            });
         });
    });
};

auth.default().then(function(res){
   var token = res.token;
   var profile_id = res.profile_id;
   client.authorize(token, profile_id, function(err, data) {
      if (err) {
         console.log(err);
      }
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
