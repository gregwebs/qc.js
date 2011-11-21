// Copyright (c) 2009, Darrin Thompson

// Tiny javascript quickcheck port.

define('qc', [
  'core', 'random', 'util',
  'generator',
  'Config', 'Distribution', 'Prop', 'ConsoleListener', 'HtmlListener', 'NodeConsoleListener'
], function() {

  var exports = {};
  var args = [].splice.call(arguments, 0);
  args.map(function(arg){
    // Add the classes to "exports".
    if (typeof arg == 'function'){
      exports[arg.name] = arg;
    } else {
      // Add all properties to the exports, mostly its a collection of functions.
      for (var prop in arg){
        exports[prop] = arg[prop];
      }
    }
  });

  /**
   * Builds and registers a new property.
   *
   *
   * @param name the property's name
   * @param gens Array of generators (length == arity of body function). The
   *             Entry at position i will drive the i-th argument of the body
   *             function.
   * @param body the properties testing function
   *
   * @return a new registered Property object.
   */
  exports.declare = function(name, gens, body) {
      var theProp = new exports.Prop(name, gens, body);
      exports.allProps.push(theProp);
      return theProp;
  };

  return exports;
});
