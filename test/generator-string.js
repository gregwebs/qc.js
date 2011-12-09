;(function(){
  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    main(qc);
  } else {
    define(['qc'], main);
  }

  function main(qc){
    qc.setTestGroupName('generator-string.js');
    var gen = qc.generator;

    qc.declare("strings", [gen.string.strings()],
      function(testCase, value) {
        testCase.assert(value === ('' + value));
      }
    );

    qc.declare("characters", [gen.string.chararcters()],
      function(testCase, value) {
        testCase.assert(value === ('' + value));
      }
    );
    //*/
  };
})();
