;(function(){
  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    main(qc);
  } else {
    define(['qc'], main);
  }

  function main(qc){
    var gen = qc.generator.number;

    qc.declare("integers", [gen.integers()],
      function(testCase, value) {
        testCase.assert(parseInt(value) === value);
      }
    );

    qc.declare("positive integers", [gen.positiveIntegers()],
      function(testCase, value) {
        testCase.assert(parseInt(value) === value && value >= 0);
      }
    );

    qc.declare("floats", [gen.floats()],
      function(testCase, value) {
        testCase.assert(parseFloat(value) === value);
      }
    );

    qc.declare("integerRanges works at all", [gen.integerRanges(-10, 10)],
      function(testCase, value) {
        testCase.assert(value >= -10 && value <= 10);
      }
    );

    qc.declare("integerRanges with random ranges", [gen.integers(), gen.integers()],
      function(testCase, minValue, maxValue) {
        var min = Math.min(minValue, maxValue);
        var max = Math.max(minValue, maxValue);
        var value = qc.generateValue(gen.integerRanges(minValue, maxValue));
        testCase.assert(value >= min && value <= max);
      }
    );

    qc.declare("floatRanges", [gen.floatRanges(-10, 10)],
      function(testCase, value) {
        testCase.assert(value >= -10 && value <= 10);
      }
    );
    
    qc.declare("floatRanges with random ranges", [gen.floats(), gen.floats()],
      function(testCase, minValue, maxValue) {
        var min = Math.min(minValue, maxValue);
        var max = Math.max(minValue, maxValue);
        var value = qc.generateValue(gen.floatRanges(minValue, maxValue));
        testCase.assert(value >= min && value <= max);
      }
    );

    //*/
  };
})();
