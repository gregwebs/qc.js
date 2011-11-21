define('random', function() {
  var exports = {};

  exports.getPositiveInteger = function(top) {
    // Lets add 1 to top, otherwise the top number wouldn't be generated.
    top = typeof top == 'undefined' ? 1 : top;
    return Math.floor(Math.random() * top);
  };

  /**
   * Generate a random number between -top and +top.
   * @param top Integer
   * @return Integer A random number.
   */
  exports.getInteger = function(top) {
    return Math.floor(Math.random() * top * 2) - top;
  };

  exports.getFloat = function() {
    return Math.random();
  };

  return exports;
});
