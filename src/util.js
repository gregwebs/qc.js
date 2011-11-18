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
  };

  /**
   * Uses the generators specific shrinking method to shrink a value the
   * generator created before. If the generator is a function or has no method
   * named 'shrink' or the objects field 'shrink' is set to null, no shrinking
   * will be done.  If a shrinking method is defined, this method is called with
   * the original seed and value the generator created. The shrinking method is
   * supposed to return an Array of shrunk(!) values or null,undefined,[] if
   * no shrunk values could have been created.
   *
   * @param gen the generator object
   * @param size the initial seed used when creating a value
   * @param arg the value the generator created for testing
   *
   * @return an array of shrunk values or [] if no shrunk values were
   *         generated.
   *
   */
  exports.generateShrunkValues = function(gen, size, arg) {
    if (!gen || gen instanceof Function ||
      gen.shrink === undefined || gen.shrink === null)
    {
      return [];
    }

    var tmp = gen.shrink(size, arg);
    return (tmp === null || tmp === undefined) ? [] : tmp;
  };

  return exports;
});
