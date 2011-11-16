define([
  'qc'
],function(qc){

  var gen = qc.generator;

  qc.declare("strings", [gen.string.strings],
    function(testCase, value) {
      testCase.assert(value === ('' + value));
    }
  );

  qc.declare("characters", [gen.string.chararcters],
    function(testCase, value) {
      testCase.assert(value === ('' + value));
    }
  );

//*/
});
