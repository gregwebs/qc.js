define([
  'random', 'util',
  'Distribution'
], function(random, util, Distribution) {
  var exports = {};

  /**
   * Return one of the results of any given generator.
   */
  exports.choose = function(/** generators... */) {
    var d = Distribution.uniform(arguments);
    return {
      arb: function (size) {
          return util.generateValue(d.pick(), size);
      },
      shrink: null
    };
  }

  /**
   * Generator builder. The created generator will always return the given
   * constant value.
   */
  var constants = exports.constants = function(/** values... */) {
    var d = Distribution.uniform(arguments);
    return {
      arb: function () {
        return d.pick();
      }
    };
  }

  /**
   * Boolean value generator. Generates true or false by 50:50 chance.
   *
   * @constant
   */
  exports.booleans = constants(false, true);

  /**
   * Null generator. Always generates 'null'.
   *
   * @constant
   */
  var nulls = exports.nulls = constants(null);

  /**
   * Array generator. Generates array of arbitrary length with given generator.
   *
   * @param {Generator} innerGen the generator create the resulting array its
   *                    values from
   * @param [shrinkStrategy] optional shrinking strategy. Default is
   *        'arrShrinkOne'
   */
  exports.arrays = function(innerGen, shrinkStrategy) {
    var generator = function(size) {
      var i, list = [];
      var listSize = random.getPositiveInteger(size);
      for (i = 0; i < listSize; i += 1) {
        list.push(util.generateValue(innerGen, size));
      }
      return list;
    }
    return { arb: generator, shrink: shrinkStrategy || arrShrinkOne };
  }

  exports.nonEmptyArrays = function(){
// TODO
    return { arb: function(){ return [1]; } }
  }

  /**
   * Date value generator. Always generates a new Date object by calling
   * 'new Date()'.
   *
   * @constant
   */
  exports.dates = {
      arb: function () {
          return new Date();
      }
  };

  exports.nullOr = function(otherGen) {
      //return arbSelect(otherGen, arbNull);
      var d = new Distribution([[10, nulls], [90, otherGen]]);
      return {
          arb: function (size) {
                  return util.generateValue(d.pick(), size);
              },
          shrink: function (size, a) {
              if (a === null) {
                  return [];
              } else {
                  return [null].concat(util.generateShrunkValues(otherGen, size, a));
              }
          }
      };
  }

  /**
   * Array shrinking strategy. Will build new Arrays by removing one element
   * from given array.
   */
// TODO still needs to go in the right place, not this file imho
  var arrShrinkOne = exports.arrShrinkOne = function(size, arr) {
      if (!arr || arr.length === 0) return [];
      if (arr.length === 1) return [[]];

      var copyAllBut = function(idx) {
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
   * What is 'mod' supposed to mean? :( (wolframkriesing)
   * @param a
   * @param fn
   */
  exports.mod = function(a, fn) {
      return {
          arb: function (size) {
              return fn(util.generateValue(a, size));
          }
      };
  }

  /**
   * 'undefined' generator. Always generates 'undefined'.
   *
   * @constant
   */
  var undefineds = exports.undefineds = constants(undefined);

  exports.undefinedOr = function(opt) {
      var d = new Distribution([[10, undefineds], [90, opt]]);
      return {
          arb: function (size) {
              return util.generateValue(d.pick(), size);
          },
          shrink: function (size, a) {
              return a === undefined || a === null ?
                         [] :
                         util.generateShrunkValues(opt, size, a);
          }
      };
  }

  return exports;
});
