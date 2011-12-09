;(function(){
  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    main(qc);
  } else {
    define(['qc'], main);
  }

  function main(qc){
    qc.setTestGroupName('generator-base.js');
    var gen = qc.generator;

    var consts = [1, 'one', 'uno'];
    qc.declare(
      'chooseValue',
      [gen.chooseValue.apply(null, consts)],
      function(testCase, value) {
        testCase.assert(consts.indexOf(value) != -1);
      }
    );

    qc.declare(
      'choose from (positive) integers',
      [gen.chooseGenerator(gen.number.integers(), gen.number.positiveIntegers())],
      function(testCase, value) {
        testCase.assert(parseInt(value)==value);
      }
    );

    qc.declare(
      'chooseGenerators',
      [gen.chooseGenerators(gen.chooseValue(1), gen.chooseValue(2), gen.chooseValue(3), gen.chooseValue(4), gen.chooseValue(5))],
      function(testCase, value) {
        // Every generated value is one of the given values.
        var reduced = value.filter(function(val){ return [1,2,3,4,5].indexOf(val)==-1; });
        testCase.assert(reduced.length==0);
        // Every value max only once in there.
        var once = value.slice(); // Clone the values.
        for (var i=1; i<6; i++){
          if (once.indexOf(i)!=-1) once.splice(once.indexOf(i), 1);
        }
        testCase.assert(once.length==0);
      }
    );

    qc.declare("booleans", [gen.booleans()],
      function(testCase, value) {
        testCase.assert(value===true || value===false);
      }
    );

    qc.declare("nulls", [gen.nulls()],
      function(testCase, value) {
        testCase.assert(value===null);
      }
    );

    var allTypes = [
      gen.number.integers(), gen.number.floats(), gen.number.positiveIntegers(),
      gen.string.strings(), gen.string.chararcters(),
      gen.booleans(), gen.nulls(), gen.dates(), gen.undefineds()
    ];
    var arrayOfAnyKindOfTypes = gen.arrays(gen.chooseGenerator.apply(null, allTypes));
    qc.declare("arrays", [arrayOfAnyKindOfTypes],
      function(testCase, value) {
        testCase.assert(Object.prototype.toString.call(value) == '[object Array]');
      }
    );

    // The arraysOfSize tests are pretty simple, but I don't know how to better test them.
    qc.declare("arrays of size", [gen.arraysOfSize([gen.nulls()])],
      function(testCase, value) {
        testCase.assert(value.length == 1);
      }
    );
    qc.declare("arrays of size", [gen.arraysOfSize([gen.nulls(), gen.number.integers(), gen.number.floats()])],
      function(testCase, value) {
        testCase.assert(value.length == 3);
      }
    );

    qc.declare("non empty arrays", [gen.nonEmptyArrays(gen.nulls())],
      function(testCase, value) {
        testCase.guard(value.length != 1); // Exclude all of length=1 so we are sure not to only get length=1.
        testCase.assert(value.length > 0);
      }
    );

    qc.declare("dates", [gen.dates()],
      function(testCase, value) {
        testCase.assert(value instanceof Date);
      }
    );

    qc.declare("null or ...", [gen.nullOr(gen.number.integers())],
      function(testCase, value) {
        testCase.assert(value===null || typeof value == 'number');
      }
    );

    qc.declare("undefineds", [gen.undefineds()],
      function(testCase, value) {
        testCase.assert(typeof value == 'undefined');
      }
    );

    qc.declare("undefined or ...", [gen.undefinedOr(gen.number.integers())],
      function(testCase, value) {
        testCase.assert(typeof value == 'undefined' || typeof value == 'number');
      }
    );
    //*/
  };
})();
