// Copyright (c) 2009, Darrin Thompson

// Some self checks for our generators.

define([
  'qc'
],function(qc){

  // Declare tests that take the current size value (which is simply a test counter,
  // that contains the current count of the generated test) and compare it
  // to any random value that is smaller than size, generated by randWhole().
  // 'justSize' is returning the current size value for each of the generated
  // tests.
  qc.declare("randWhole", [qc.justSize],
          function(c, a) {
              var result = qc.randWhole(a);
              c.noteArg(result);
              c.assert(result < a || result == 0);
          });

  // Some arbitrary guard, to only allow numbers above 10 to be valid tests.
  // And numbers below zero leads to invalid result, so failures seem
  // not possible.
  qc.declare("randWhole nonzero, larger than 10", [qc.justSize],
          function(c, a) {
              c.guard(a > 10);
              var result = qc.randWhole(a);
              c.noteArg(result);
              c.guard(result > 0);
          });

  qc.declare("randWhole zero result", [qc.justSize],
          function(c, a) {
              var result = qc.randWhole(a);
              c.noteArg(result);
              c.guard(result == 0);
          });

  qc.declare("randInt show positive", [qc.arbWholeNum],
          function(c, a) {
              var result = qc.randInt(a);
              c.noteArg(result);
              c.guard(result > 0);
          });

  qc.declare("randInt show negative", [qc.arbWholeNum],
          function(c, a) {
              var result = qc.randInt(a);
              c.noteArg(result);
              c.guard(result < 0);
          });

  qc.declare("randInt zero result", [qc.arbWholeNum],
          function(c, a) {
              c.guard(a > 0);
              var result = qc.randInt(a);
              c.noteArg(result);
              c.guard(result == 0);
          });

  qc.declare("randRange between", [qc.arbInt, qc.arbInt],
          function(c, a, b) {
              c.guard(a < b);
              var result = qc.randRange(a, b);
              c.noteArg(result);
              c.assert(a <= result);
              c.assert(b > result);
          });

  qc.declare("randRange between backwards", [qc.arbInt, qc.arbInt],
          function(c, a, b) {
              c.guard(b < a);
              var result = qc.randRange(a, b);
              c.noteArg(result);
              c.assert(b <= result);
              c.assert(a > result);
          });

  qc.declare("randRange equal", [qc.arbInt],
          function(c, a, b) {
              var result = qc.randRange(a, a);
              c.assert(a == result);
          });

  qc.declare("randFloatUnit", [],
    function(c) {
        var result = qc.randFloatUnit();
        c.noteArg(result);
        c.assert(result >= 0);
        c.assert(result < 1);
    });

  qc.declare("collectTest", [qc.arbArray(qc.arbInt)],
      function(c,a) {
          c.classify(a.length == 0, "empty array");
          c.collect(a.length);
      });
/*
  var testArr = [1,2,0,1,0];
  var testArb = {
      arb: function(){
          return testArr;
      },
      shrink: function(s,a) {
          //print('input: ' + a);
          var r = a.slice(1);
          //print('ret: ' + r);
          return r.length == 0 ? [] : [r];
      }
  }

  qc.declare("shrinkTest... must FAIL", [testArb],
          function(c){
              c.assert(false);
          });

  qc.declare("expect Exception", [qc.arbInt],
          qc.expectException(function(c,i) {
              throw("test");
          }));
//*/
});
