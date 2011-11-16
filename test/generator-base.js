// Copyright (c) 2009, Darrin Thompson

// Some self checks for our generators.

define([
  'qc'
],function(qc){

  var gen = qc.generator;

  var consts = [1, 'one', 'uno'];
  qc.declare("constants", [gen.constants.apply(null, consts)],
    function(c, a) {
      c.assert(consts.indexOf(a) != -1);
    }
  );

  qc.declare(
    "choose from (positive) integers",
    [gen.choose(gen.number.integers, gen.number.positiveIntegers)],
    function(c, a) {
      c.assert(parseInt(a)==a);
    }
  );

  qc.declare("booleans", [gen.booleans],
    function(c, a) {
      c.assert(a===true || a===false);
    }
  );



/*
  qc.declare("random positive integer", [random.getPositiveInteger],
    function(c, a) {
      c.assert(!isNaN(a) && parseInt(a)===a && a >= 0);
    }
  );

  qc.declare("random float", [random.getFloat],
    function(c, a) {
      c.assert(!isNaN(a));
    }
  );
//*/
});
