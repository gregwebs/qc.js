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

  qc.declare("random range", [qc.randRange],
    function(c, a) {
      c.assert(!isNaN(a) && parseInt(a)===a);
    }
  );




//  qc.declare("randRange", [qc.randRange],
//    function(c, a) {
//      c.assert(!isNaN(a) && parseInt(a)===a);
//    }
//  );
//*/
});
