define([
  'core', 'rand',
  'Distribution'
], function(qs, rand, Distribution) {
  var exports = {};
  exports.arbChoose = function(/** generators... */) {
      var d = Distribution.uniform(arguments);
      return {
          arb: function (size) {
                  return genvalue(d.pick(), size);
              },
          shrink: null
      };
  }

  /**
   * Generator builder. The created generator will always return the given
   * constant value.
   */
  var arbConst = exports.arbConst = function(/** values... */) {
      var d = Distribution.uniform(arguments);
      return {
          arb: function () { return d.pick(); }
      };
  }


  /**
   * Boolean value generator. Generates true or false by 50:50 chance.
   *
   * @constant
   */
  exports.arbBool = {
      arb: qs.choose(false, true)
  };

  /**
   * Null generator. Always generates 'null'.
   *
   * @constant
   */
  exports.arbNull = arbConst(null);

  /**
   * Integer value generator. All generated values are >= 0.<br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.arbWholeNum = {
      arb: rand.randWhole,
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
   * Integer value generator.  <br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.arbInt = {
      arb: rand.randInt,
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
   * Float value generator. Generates a floating point value in between 0.0 and
   * 1.0. <br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.arbFloatUnit = {
      arb: rand.randFloatUnit,
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

  var arbRange = exports.arbRange = function(a, b) {
      var min = Math.min(a, b),
          max = Math.max(a, b);

      return function (size) {
          return Math.floor(Math.random() * (max - min)) + min;
      };
  }

  exports.arbNullOr = function(otherGen) {
      //return arbSelect(otherGen, arbNull);
      var d = new Distribution([[10, arbNull], [90, otherGen]]);
      return {
          arb: function (size) {
                  return genvalue(d.pick(), size);
              },
          shrink: function (size, a) {
              if (a === null) {
                  return [];
              } else {
                  return [null].concat(genshrinked(otherGen, size, a));
              }
          }
      };
  }

  /**
   * Array shrinking strategy. Will build new Arrays by removing one element
   * from given array.
   */
  var arrShrinkOne = exports.arrShrinkOne = function(size, arr) {
      if (!arr || arr.length === 0) return [];
      if (arr.length === 1) return [[]];

      function copyAllBut(idx) {
          var i, tmp = new Array(arr.length - 1);
          for (i = 0; i < arr.length; i++) {
              if (i === idx) {
                  continue;
              }
              tmp[i < idx ? i : i - 1] = arr[i];
          }
          return tmp;
      }

      var i, ret = new Array(arr.length);
      for (i = 0; i < arr.length; i++) {
          ret[i] = copyAllBut(i);
      }
      return ret;
  }

  /**
   * Array generator. Generates array of arbitrary length with given generator.
   *
   * @param {Generator} innerGen the generator create the resulting array its
   *                    values from
   * @param [shrinkStrategy] optional shrinking strategy. Default is
   *        'arrShrinkOne'
   */
  var arbArray = exports.arbArray = function(innerGen, shrinkStrategy) {
      function gen(size) {
          var i, list = [],
              listSize = rand.randWhole(size);
          for (i = 0; i < listSize; i += 1) {
              list.push(qs.genvalue(innerGen, size));
          }
          return list;
      }

      return { arb: gen, shrink: shrinkStrategy || arrShrinkOne };
  }

  /**
   * Date value generator. Always generates a new Date object by calling
   * 'new Date()'.
   *
   * @constant
   */
  exports.arbDate = {
      arb: function () {
          return new Date();
      }
  };

  var arbMod = exports.arbMod = function(a, fn) {
      return {
          arb: function (size) {
              return fn(genvalue(a, size));
          }
      };
  }

  /**
   * Character value generator.
   * Will generate any character with char code in range 32-255.
   *
   * @constant
   */
  exports.arbChar = arbMod(arbRange(32, 255),
                       function (num) {
                           return String.fromCharCode(num);
                       });

  /**
   * String value generator. All characters in the generated String
   * are in range 32-255.<br/>
   * Supports shrinking.
   *
   * @constant
   */
  exports.arbString = new function () {
      var a = arbArray(arbRange(32, 255));

      this.arb = function (size) {
          var tmp = genvalue(a, size);
          return String.fromCharCode.apply(String, tmp);
      };

      this.shrink = function (size, str) {
          var i, ret = [], tmp = new Array(str.length);
          for (i = 0; i < str.length; i++) {
              tmp[i] = str.charCodeAt(i);
          }

          tmp = genshrinked(a, size, tmp);
          ret = [];
          for (i = 0; i < tmp.length; i++) {
              ret.push(String.fromCharCode.apply(String, tmp[i]));
          }
          return ret;
      };

      return this;
  };

  /**
   * 'undefined' generator. Always generates 'undefined'.
   *
   * @constant
   */
  exports.arbUndef = arbConst(undefined);

  exports.arbUndefOr = function(opt) {
      var d = new Distribution([[10, arbUndef], [90, opt]]);
      return {
          arb: function (size) {
              return genvalue(d.pick(), size);
          },
          shrink: function (size, a) {
              return a === undefined || a === null ?
                         [] :
                         genshrinked(opt, size, a);
          }
      };
  }

  return exports;
});
