;(function(){
  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    main(qc);
  } else {
    define(['qc'], main);
  }

  var main = function(qc){
    qc.declare("random integer", [qc.getInteger],
      function(c, a) {
        c.assert(!isNaN(a) && parseInt(a)===a);
      }
    );

    qc.declare("random positive integer", [qc.getPositiveInteger],
      function(c, a) {
        c.assert(!isNaN(a) && parseInt(a)===a && a >= 0);
      }
    );

    qc.declare("random float", [qc.getFloat],
      function(c, a) {
        c.assert(!isNaN(a));
      }
    );
    //*/
  };
})();
