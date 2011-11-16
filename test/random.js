// Copyright (c) 2009, Darrin Thompson

// Some self checks for our generators.

define([
  'qc', 'random'
],function(qc, random){

  qc.declare("random integer", [random.getInteger],
    function(c, a) {
      c.assert(!isNaN(a) && parseInt(a)===a);
    }
  );

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
