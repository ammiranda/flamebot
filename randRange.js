module.exports = {
   randIntInRange: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   },

   randNumInRange: function(min, max) {
      return Math.random() * (max - min) + min;
   }
};
