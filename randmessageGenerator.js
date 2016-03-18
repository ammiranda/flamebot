var messages = require('./messages.json').textChoices;
var choiceLength = messages.length;

module.exports = {
   getResponse: function() {
      return messages[Math.floor(Math.random() * choiceLength)];
   }
};
