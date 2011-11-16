define(function() {
  var exports = {};
  
  var getPositiveInteger = exports.getPositiveInteger = function(top) {
      return Math.floor(Math.random() * top);
  }

  /**
   * Generate a random number between -top and +top.
   * @param top Integer
   * @return Integer A random number.
   */
  exports.getInteger = function(top) {
      return getPositiveInteger(2 * top) - top;
  }

  exports.getRange = function(a, b) {
      return getPositiveInteger(b - a) + a;
  }

  exports.getFloat = function() {
      return Math.random();
  }

  return exports;
});