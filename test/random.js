;(function(){
  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    main(qc);
  } else {
    define(['qc'], main);
  }

  function makeGenerator(func){
    return { func:func }
  }

  function main(qc){
    qc.declare("random integer", [makeGenerator(qc.getInteger)],
      function(c, a) {
        c.assert(!isNaN(a) && parseInt(a)===a);
      }
    );

    qc.declare("random positive integer", [makeGenerator(qc.getPositiveInteger)],
      function(c, a) {
        c.assert(!isNaN(a) && parseInt(a)===a && a >= 0);
      }
    );

    qc.declare("random float", [makeGenerator(qc.getFloat)],
      function(c, a) {
        c.assert(!isNaN(a));
      }
    );

    qc.declare("random float with random top", [makeGenerator(qc.getFloat)],
      function(testCase, value) {
        testCase.assert(!isNaN(value) && value==parseFloat(value));
      }
    );
    //*/
  };
})();
