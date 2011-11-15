/**
 * All functions provided in here are just private utility functions
 * that are used throughout qc.
 * 
 */
define(function() {

  var exports = {};

  /**
   * draws a new value from a generator.
   * A generator is either a function accepting a seed argument or an object
   * with a method 'arb' accepting a seed argument.
   *
   * @param gen Function or Generator object with method 'arb'
   * @param {Number} size seed argument
   *
   * @return new generated value
   */
  exports.generateValue = function(gen, size) {
      if (!(gen instanceof Function)) {
          gen = gen.arb;
      }
      return gen(size);
  }

  return exports;
});