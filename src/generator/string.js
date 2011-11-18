define('generator/string', [
  'generator/base', 'generator/number', 'util'
],function(base, number, util) {
  var exports = {};

  /**
   * String value generator. All characters in the generated String
   * are in range 32-255.<br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.strings = (function() {
      var a = base.arrays(number.range(32, 255));

      var arb = function (size) {
          // Add 10 to the size to really get a string, not am empty string so often in the beginning.
          var tmp = util.generateValue(a, size+10);
          return String.fromCharCode.apply(String, tmp);
      };

      var shrink = function (size, str) {
          var i, ret = [], tmp = new Array(str.length);
          for (i = 0; i < str.length; i++) {
              tmp[i] = str.charCodeAt(i);
          }

          tmp = util.generateShrunkValues(a, size, tmp);
          ret = [];
          for (i = 0; i < tmp.length; i++) {
              ret.push(String.fromCharCode.apply(String, tmp[i]));
          }
          return ret;
      };

      return { arb: arb, shrink: shrink };
  })();

  /**
   * Character value generator.
   * Will generate any character with char code in range 32-255.
   *
   * @constant
   */
  exports.chararcters = base.mod(
    number.range(32, 255),
    function (num) { return String.fromCharCode(num); }
  );

  exports.nonEmptys = {
  };

  return exports;
});
