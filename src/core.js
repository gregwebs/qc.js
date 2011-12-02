define('core', [
  'Distribution', 'Case', 'ConsoleListener'
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
   * @private
   */
  exports.shrinkLoop = function(config, prop, size, args) {
    var i, testCase;
    var failedArgs = [args], shrunkArgs = [];
    for (var loop = 0; loop < config.maxShrink; loop++) {
      // Create shrunk argument lists from failed arguments.
      shrunkArgs = [];
      for (i = 0; i < failedArgs.length; i++) {
        shrunkArgs = shrunkArgs.concat(
          prop.generateShrunkArgs(size, failedArgs[i]));
      }
      if (shrunkArgs.length === 0) {
        return failedArgs.length === 0 ? null : failedArgs[0];
      }
      // Create new failed arguments from shrunk ones by running the property.
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
  };

  /**
   * All tests that had been defined by qc.declare() are executed
   * by this function.
   * @param config The configuration for all the test runs.
   * @param listener The result reporter.
   */
  exports.runProps = function(config, listener) {
    var once, i = 0;
    listener = typeof listener == 'undefined' ? new ConsoleListener() : listener;

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

  function filterProps(searchString){
    if (!searchString){
      return allProps;
    }
    var searchFor = searchString.toLowerCase();
    return allProps.filter(function(prop){
      return prop.name.toLowerCase().indexOf(searchFor) != -1;
    });
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

  return exports;
});
