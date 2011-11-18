define('generator/number', [
  'random', 'generator/base'
], function(random, base) {
  var exports = {};

  /**
   * Integer value generator.
   * Supports shrinking.
   *
   * @constant
   */
  exports.integers = {
      arb: function(size){
        var ret = random.getInteger(size);
        return ret;
      },
      shrink: function (size, x) {
          var tmp = x, ret = [];
          if (x < 0) {
              ret.push(-x);
          }

          while (true) {
              tmp = tmp / 2;
              if (tmp === 0) {
                  break;
              }

              tmp = tmp < 0 ? Math.ceil(tmp) : Math.floor(tmp);
              ret.push(x - tmp);
          }
          return ret;
      }
  };

  /**
   * Integer value generator. All generated values are >= 0.<br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.positiveIntegers = {
      arb: random.getPositiveInteger,
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

  /**
   * Float value generator. Generates a floating point value in between 0.0 and
   * 1.0. <br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.floats = {
      arb: random.getFloat,
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

  exports.range = function(minValue, maxValue) {
    var min = Math.min(minValue, maxValue);
    var max = Math.max(minValue, maxValue);
    var generator = function() {
      return Math.floor(Math.random() * (max - min)) + min;
    };
    return { arb: generator };
  };

  return exports;
});
