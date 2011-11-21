;(function(){

  var main = function(qc){
    var gen = qc.generator.number;

    qc.declare("integers", [gen.integers],
      function(testCase, value) {
        testCase.assert(parseInt(value) === value);
      }
    );

    qc.declare("positive integers", [gen.positiveIntegers],
      function(testCase, value) {
        testCase.assert(parseInt(value) === value && value >= 0);
      }
    );

    qc.declare("floats", [gen.floats],
      function(testCase, value) {
        testCase.assert(parseFloat(value) === value);
      }
    );

    qc.declare("range", [gen.range(-10, 10)],
      function(testCase, value) {
        testCase.assert(value >= -10 && value <= 10);
      }
    );

  };

  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    main(qc);
  } else {
    define(['qc'], main);
  }

//*/
})();
