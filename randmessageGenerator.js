var messages = require('/home/alex/tinderbot/messages.json').textChoices;
var choiceLength = messages.length;

module.exports = {
   getResponse: function() {
      return messages[Math.floor(Math.random() * choiceLength)];
   }
};
