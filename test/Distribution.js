define([
  'qc'
],function(qc){

  var gen = qc.generator;

  var distributionArrays =
    gen.nonEmptyArrays( // Generate an array with at least one of the following elements.
      gen.arraysOfSize( // Generate an array with a fixed size with the two following elements.
        [
          gen.number.range(1, 1000), // First element is always a number, the probability.
          gen.string.strings // Second element is always a string, the value.
        ]
      )
    );
  qc.declare("getProbablity", [distributionArrays],
    function(testCase, value) {
      
      var d = new qc.Distribution(value);
      // Sum up all probabilities.
      var probabilitySum = value.reduce(function(lastValue, arr){return arr[0]+lastValue}, 0);
      var arrIndex = qc.getPositiveInteger(value.length);
      var val = d.getProbability(value[arrIndex][1]);
      testCase.assert(val == value[arrIndex][0]/probabilitySum);
    }
  );

//  qc.declare("normalize", [gen.integers],
//    function(testCase, value) {
//      testCase.assert(parseInt(value) === value);
//    }
//  );

//*/
});
