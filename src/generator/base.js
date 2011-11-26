define('generator/base', [
  'random', 'util',
  'Distribution'
], function(random, util, Distribution) {
  var exports = {};

  /**
   * Return one of the results of any given generator.
   */
  exports.chooseGenerator = function(/** generators... */) {
    var d = Distribution.uniform(arguments);
    return {
      arb: function (size) {
          return util.generateValue(d.pick(), size);
      },
      shrink: null
    };
  };

  /**
   * Generator builder. The created generator will always return the given
   * constant value.
   */
  var chooseValue = exports.chooseValue = function(/** values... */) {
    var d = Distribution.uniform(arguments);
    return {
      arb: function () {
        return d.pick();
      }
    };
  };

  /**
   * Boolean value generator. Generates true or false by 50:50 chance.
   *
   * @constant
   */
  exports.booleans = function(){
    return chooseValue(false, true);
  };

  /**
   * Null generator. Always generates 'null'.
   *
   * @constant
   */
  var nulls = exports.nulls = function(){
    return chooseValue(null);
  };

  /**
   * Array generator. Generates array of arbitrary length with given generator.
   *
   * @param {Generator} innerGen the generator create the resulting array its
   *                    values from
   * @param [shrinkStrategy] optional shrinking strategy. Default is
   *        'arrShrinkOne'
   */
  var arrays = exports.arrays = function(generator, shrinkStrategy, minSize) {
    var generatorFunc = function(size) {
      var i, list = [];
      var listSize = random.getPositiveInteger(size);
      if (minSize){
        listSize = Math.max(listSize, minSize);
      }
      for (i = 0; i < listSize; i += 1) {
        list.push(util.generateValue(generator, size));
      }
      return list;
    };
    return { arb: generatorFunc, shrink: shrinkStrategy || arrShrinkOne };
  };

  /**
   * Generate an array with a fixed length of the number of generators given.
   * For example:
   *    qs.generator.arraysOfSize([qs.generator.null, qs.generator.boolean])
   * will always create an array with exactly two element.
   * @param generator The generator to fill the array with content.
   * @param shrinkStrategy Shrink the result in case of failure, to narrow down the failing values.
   */
  exports.arraysOfSize = function(generators, shrinkStrategy) {
    var generator = function(size) {
      return generators.map(function(g){ return util.generateValue(g, size); });
    };
    return { arb: generator, shrink: shrinkStrategy || arrShrinkOne };
  };

  /**
   * Generate arrays with at least one element.
   * @param generator The generator to fill the array with content.
   * @param shrinkStrategy Shrink the result in case of failure, to narrow down the failing values.
   */
  exports.nonEmptyArrays = function(generator, shrinkStrategy){
    return arrays(generator, shrinkStrategy, 1);
  };


  /**
   * Date value generator. Always generates a new Date object by calling
   * 'new Date()'.
   *
   * @constant
   */
  exports.dates = function(){
    return {
      arb: function () {
          return new Date();
      }
    }
  };

  exports.nullOr = function(otherGen) {
      //return arbSelect(otherGen, arbNull);
      var d = new Distribution([[10, nulls()], [90, otherGen]]);
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
  };

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
      };

      var i, ret = new Array(arr.length);
      for (i = 0; i < arr.length; i++) {
          ret[i] = copyAllBut(i);
      }
      return ret;
  };

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
  };

  /**
   * 'undefined' generator. Always generates 'undefined'.
   *
   * @constant
   */
  var undefineds = exports.undefineds = function(){
    return chooseValue(undefined);
  };

  exports.undefinedOr = function(opt) {
      var d = new Distribution([[10, undefineds()], [90, opt]]);
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
  };

  return exports;
});
