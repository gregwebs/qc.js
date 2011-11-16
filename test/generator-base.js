// Copyright (c) 2009, Darrin Thompson

// Some self checks for our generators.

define([
  'qc'
],function(qc){

  var gen = qc.generator;

  var consts = [1, 'one', 'uno'];
  qc.declare("constants", [gen.constants.apply(null, consts)],
    function(testCase, value) {
      testCase.assert(consts.indexOf(value) != -1);
    }
  );

  qc.declare(
    "choose from (positive) integers",
    [gen.choose(gen.number.integers, gen.number.positiveIntegers)],
    function(testCase, value) {
      testCase.assert(parseInt(value)==value);
    }
  );

  qc.declare("booleans", [gen.booleans],
    function(testCase, value) {
      testCase.assert(value===true || value===false);
    }
  );

  qc.declare("nulls", [gen.nulls],
    function(testCase, value) {
      testCase.assert(value===null);
    }
  );

  var allTypes = [
    gen.number.integers, gen.number.floats, gen.number.positiveIntegers,
    gen.string.strings, gen.string.chararcters,
    gen.booleans, gen.nulls, gen.dates, gen.undefineds
  ];
  qc.declare("arrays", [gen.arrays(gen.choose.apply(null, allTypes))],
    function(testCase, value) {
      testCase.assert(Object.prototype.toString.call(value) == '[object Array]');
    }
  );

//  qc.declare("non empty arrays", [gen.nonEmptyArrays],
//    function(testCase, value) {
//      testCase.assert(0);
//    }
//  );
//
  qc.declare("dates", [gen.dates],
    function(testCase, value) {
      testCase.assert(value instanceof Date);
    }
  );

  qc.declare("null or ...", [gen.nullOr(gen.number.integers)],
    function(testCase, value) {
      testCase.assert(value===null || typeof value == 'number');
    }
  );

  qc.declare("undefineds", [gen.undefineds],
    function(testCase, value) {
      testCase.assert(typeof value == 'undefined');
    }
  );

  qc.declare("undefined or ...", [gen.undefinedOr(gen.number.integers)],
    function(testCase, value) {
      testCase.assert(typeof value == 'undefined' || typeof value == 'number');
    }
  );



/*
  qc.declare("random positive integer", [random.getPositiveInteger],
    function(c, a) {
      testCase.assert(!isNaN(a) && parseInt(a)===a && a >= 0);
    }
  );

  qc.declare("random float", [random.getFloat],
    function(c, a) {
      testCase.assert(!isNaN(a));
    }
  );
//*/
});
