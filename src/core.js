define([
  'Distribution', 'Case'
], function(Distribution, Case) {

  var exports = {};
  /**
   * Array of all declared/registered properties
   */
  var allProps = exports.allProps = [];


  /**
   * deletes all declared properties
   */
  exports.resetProps = function() {
      allProps = [];
  }

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
  exports.genshrinked = function(gen, size, arg) {
      if (!gen || gen instanceof Function ||
          gen.shrink === undefined || gen.shrink === null)
      {
          return [];
      }

      var tmp = gen.shrink(size, arg);
      return (tmp === null || tmp === undefined) ? [] : tmp;
  }

  /**
   * @private
   */
  exports.shrinkLoop = function(config, prop, size, args) {
      var loop, i, testCase, failedArgs = [args], shrunkArgs = [];

      for (loop = 0; loop < config.maxShrink; loop++) {
          // create shrinked argument lists from failed arguments

          shrunkArgs = [];
          for (i = 0; i < failedArgs.length; i++) {
              shrunkArgs = shrunkArgs.concat(
                  prop.generateshrunkArgs(size, failedArgs[i]));
          }

          if (shrunkArgs.length === 0) {
              return failedArgs.length === 0 ? null : failedArgs[0];
          }

          // create new failed arguments from shrinked ones by running the
          // property
          failedArgs = [];
          for (i = 0; i < shrunkArgs.length; i++) {
              try {
                  testCase = new Case(shrunkArgs[i]);
                  prop.body.apply(prop, [testCase].concat(shrunkArgs[i]));
              } catch (e) {
                  if (e === 'InvalidCase') {
                  } else if (e === 'AssertFailed') {
                      if (loop === config.maxShrink - 1) {
                          return shrunkArgs[i];
                      } else {
                          failedArgs.push(shrunkArgs[i]);
                      }
                  } else {
                      throw e;
                  }
              }
          }
      }

      return failedArgs.length === 0 ? null : failedArgs[0];
  }

  exports.runAllProps = function(config, listener) {
      var once, i = 0;

      if (typeof setTimeout !== 'undefined') {
          // Use set timeout so listeners can draw in response to events.
          once = function () {
              if (i >= allProps.length) {
                  listener.done();
                  return;
              }
              var currentProp = allProps[i];
              var result = currentProp.run(config);
              listener.noteResult(result);
              i += 1;
              setTimeout(once, 0);
          };
          once();
      } else {
          for (; i < allProps.length; i++) {
              listener.noteResult(allProps[i].run(config));
          }
      }
  }


  // some starter generators and support utilities.

  exports.frequency = function(/** functions */) {
      var d = new Distribution(arguments);
      return function () {
          return d.pick();
      };
  }

  exports.choose = function(/** values */) {
      var d = Distribution.uniform(arguments);
      return function () {
          return d.pick();
      };
  }


  /**
   * Passes the size 'seed' argument use to drive generators directly to the
   * property its test function.
   *
   * @constant
   */
  exports.justSize = {
      arb: function (size) {
              return size;
          },
      shrink: null
  };


  /**
   * Property test function modifier. Using this modifier, it is assumed that
   * the testing function will throw an exception and if not the property will
   * fail.
   */
  exports.expectException = function(fn) {
      return function (c) {
          try {
              fn.apply(this, arguments);
          } catch (e) {
              if (e === 'AssertFailed' || e === 'InvalidCase') {
                  throw e;
              }
              c.assert(true);
              return;
          }
          c.assert(false);
      };
  }

  /**
   * Property test function modifier. Instead of finishing testing when an
   * unexpected exception is thrown, the offending property is marked as failure
   * and QuickCheck will continue.
   */
  exports.failOnException = function(fn) {
      return function (c) {
          try {
              fn.apply(this, arguments);
          } catch (e) {
              if (e === 'AssertFailed' || e === 'InvalidCase') {
                  throw e;
              }
              c.assert(false);
          }
      };
  }

  return exports;
});
