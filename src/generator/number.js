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
  exports.floats = function() {
    return {
      func: function(size) {
        return random.getFloat(size);
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

  exports.floatRanges = function(minValue, maxValue) {
    var min = minValue < maxValue ? minValue : maxValue;
    var max = minValue < maxValue ? maxValue : minValue;
    var maxMinusMin = max - min; // Precalculate this here, for a bit of speed.
    return {
      func: function() {
        return Math.random() * maxMinusMin + min;
      }
    };
  };

  return exports;
});
