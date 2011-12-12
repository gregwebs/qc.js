define('generator/number', [
  'random'
], function(random) {
  var exports = {};

  /**
   * Integer value generator.
   * Supports shrinking.
   *
   * @constant
   */
  exports.integers = function() {
    return {
      func: function(size) {
        return random.getInteger(size);
      },
      shrink: function (size, x) {
          var tmp = x, ret = [];
          if (x < 0) {
              ret.push(-x);
          }

          while (true) {
              tmp = tmp / 2;
              if (tmp === 0 || isNaN(tmp)) { // If tmp is not a number quit too, should not happen.
                  break;
              }

              tmp = tmp < 0 ? Math.ceil(tmp) : Math.floor(tmp);
              ret.push(x - tmp);
          }
          return ret;
      }
    };
  };

  /**
   * Integer value generator. All generated values are >= 0.<br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.positiveIntegers = function() {
    return {
      func: function(size) {
        return random.getPositiveInteger(size);
      },
      shrink: function (size, x) {
          var tmp = x, ret = [];
          while (true) {
              if (0 === (tmp = Math.floor(tmp / 2))) {
                  break;
              }
              ret.push(x - tmp);
          }
          return ret;
      }
    };
  };

  /**
   * Float value generator. Generates a floating point value in between 0.0 and
   * 1.0. <br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.floats = function(digitsAfterComma) {
    return {
      func: function(size) {
        var ret = random.getFloat(size);
        if (digitsAfterComma){
          var precision = Math.pow(10, digitsAfterComma);
          ret = parseInt(ret * precision)/precision;
        }
        return ret;
      },
      shrink: function (size, x) {
          var tmp, ret = [];

          if (x < 0) {
              ret.push(-x);
              tmp = Math.ceil(x);
          } else {
              tmp = Math.floor(x);
          }

          if (tmp !== x) ret.push(tmp);

          return ret;
      }
    };
  };

  exports.integerRanges = function(minValue, maxValue) {
    var min = minValue < maxValue ? minValue : maxValue;
    var max = minValue < maxValue ? maxValue : minValue;
    var maxMinusMin = max - min; // Precalculate this here, for a bit of speed.
    return {
      func: function() {
        return Math.floor(Math.random() * maxMinusMin) + min;
      }
    };
  };

  exports.floatRanges = function(minValue, maxValue, digitsAfterComma) {
    var min = minValue < maxValue ? minValue : maxValue;
    var max = minValue < maxValue ? maxValue : minValue;
    var maxMinusMin = max - min; // Precalculate this here, for a bit of speed.
    return {
      func: function() {
// The porblem here is that if we get smthg like    13.123...14 with precision 1 and the random number is 13.1 its actually smaller than the expected range :( ... gotta think about how to do this right, its really simple, i am sure
//        if (digitsAfterComma){
//          var precision = Math.pow(10, digitsAfterComma);
//          var precisionPlusOne = Math.pow(10, digitsAfterComma+1);
//          var ret = Math.random() * maxMinusMin * precisionPlusOne;
//console.log(ret);
//          ret = parseInt(ret/precision);
//        } else {
          var ret = Math.random() * maxMinusMin + min;
//        }
        return ret;
      }
    };
  };

  return exports;
});
