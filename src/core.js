define('core', [
  'Distribution',
  'Case',
  'ConsoleListener'
], function(Distribution, Case, ConsoleListener) {

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
  };

  /**
   * All tests that had been defined by qc.declare() are executed
   * by this function.
   * @param config The configuration for all the test runs.
   * @param listener The result reporter.
   */
  exports.runProps = function(config, listener) {
    var once, i = 0;
    listener = listener || new ConsoleListener();

    var propsToRun = filterProps(config.searchString);

    if (typeof setTimeout !== 'undefined') {
      // Use set timeout so listeners can draw in response to events.
      once = function () {
        if (i >= propsToRun.length) {
          listener.done();
          return;
        }
        var currentProp = propsToRun[i];
        var result = currentProp.run(config);
        listener.noteResult(result);
        i += 1;
        setTimeout(once, 0);
      };
      once();
    } else {
      for (; i < propsToRun.length; i++) {
        listener.noteResult(propsToRun[i].run(config));
      }
    }
  };

  function filterProps(searchString) {
    var ret = [];
    if (!searchString) {
      // No search string given.
      ret = allProps;
    }else if (searchString.match(/^\/.*\/$/)) {
      // The search string is a regular expression, it starts and ends with "/".
      var regexp = new RegExp(searchString.slice(1, -1));
      ret = allProps.filter(function(prop) {
        return prop.name.match(regexp) || prop.groupName.match(regexp);
      });
    } else {
      // The search string is a pure stirng.
      var searchFor = searchString.toLowerCase();
      ret = allProps.filter(function(prop) {
        return (prop.name.toLowerCase().indexOf(searchFor) != -1) || (prop.groupName.toLowerCase().indexOf(searchFor) != -1);
      });
    }
    return ret;
  }

  // some starter generators and support utilities.

  exports.frequency = function(/** functions */) {
    var d = new Distribution(arguments);
    return function () {
      return d.pick();
    };
  };

  exports.choose = function(/** values */) {
    var d = Distribution.uniform(arguments);
    return function () {
      return d.pick();
    };
  };


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
  };

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
  };

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
  exports.generateValue = function(generator, size) {
    return generator.func(size);
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
    if (typeof gen.shrink == 'undefined') {
      return [];
    }
    return gen.shrink(size, arg) || [];
  };

  return exports;
});
