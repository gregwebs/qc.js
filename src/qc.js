// Copyright (c) 2009, Darrin Thompson

// Tiny javascript quickcheck port.

define('qc', [
  'core', 'random', 'util',
  'generator/__all__',
  'Config', 'Distribution', 'Prop', 'ConsoleListener', 'HtmlListener', 'NodeConsoleListener'
], function(
  core, random, util,
  generator,
  Config, Distribution, Prop, ConsoleListener, HtmlListener, NodeConsoleListener){

  var exports = {
    Config: Config,
    Distribution: Distribution,
    Prop: Prop,
    ConsoleListener: ConsoleListener,
    HtmlListener: HtmlListener,
    NodeConsoleListener: NodeConsoleListener,
    generator: generator
  };
  [core, random, util].map(function(arg){
    // Add all properties to the exports, mostly its a collection of functions.
    for (var prop in arg){
      exports[prop] = arg[prop];
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
