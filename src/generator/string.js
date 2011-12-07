define('generator/string', [
  'core',
  'generator/base',
  'generator/number'
],function(qc, base, number) {
  var exports = {};

  /**
   * String value generator. All characters in the generated String
   * are in range 32-255.<br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.strings = function() {
      var a = base.arrays(number.integerRanges(32, 255));

      var func = function (size) {
          // Add 10 to the size to really get a string, not am empty string so often in the beginning.
          var tmp = qc.generateValue(a, size+10);
          return String.fromCharCode.apply(String, tmp);
      };

      var shrink = function (size, str) {
          var i, ret = [], tmp = new Array(str.length);
          for (i = 0; i < str.length; i++) {
              tmp[i] = str.charCodeAt(i);
          }

          tmp = qc.generateShrunkValues(a, size, tmp);
          ret = [];
          for (i = 0; i < tmp.length; i++) {
              ret.push(String.fromCharCode.apply(String, tmp[i]));
          }
          return ret;
      };

      return { func: func, shrink: shrink };
  };

  /**
   * Character value generator.
   * Will generate any character with char code in range 32-255.
   *
   * @constant
   */
  exports.chararcters = function() {
    return base.mod(
      number.integerRanges(32, 255),
      function (num) { return String.fromCharCode(num); }
    );
  };

  exports.nonEmptys = {
  };

  return exports;
});
