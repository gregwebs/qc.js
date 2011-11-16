define([
  'generator/base', 'generator/number'
],function(base, number) {
  var exports = {};

  /**
   * String value generator. All characters in the generated String
   * are in range 32-255.<br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.strings = new function () {
      var a = base.arrays(number.range(32, 255));

      this.arb = function (size) {
          var tmp = util.generateValue(a, size);
          return String.fromCharCode.apply(String, tmp);
      };

      this.shrink = function (size, str) {
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

      return this;
  };

  /**
   * Character value generator.
   * Will generate any character with char code in range 32-255.
   *
   * @constant
   */
  exports.chararcters = base.mod(number.range(32, 255), function (num) {
      return String.fromCharCode(num);
    }
  );

  exports.nonEmptys = {
  };
  
});