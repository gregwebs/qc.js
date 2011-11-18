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

  qc.declare("normalize", [distributionArrays],
    function(testCase, value) {
      var d = new qc.Distribution(value);
      var sum = d.data.reduce(function(last, curArr){ return last+curArr[0] }, 0);
      // Multply and round to catch 0.99999, which happens with adding up floating numbers.
      testCase.assert(Math.round(sum*100)/100 == 1);
    }
  );

  qc.declare("mostProbable", [distributionArrays],
    function(testCase, value) {
      var d = new qc.Distribution(value);
      var highestProbability = d.data.reduce(function(last, curArr){ return curArr[0] > last[0] ? curArr : last; }, [0]);
      // Multply and round to catch 0.99999, which happens with adding up floating numbers.
      testCase.assert(highestProbability[1] == d.getMostProbable());
    }
  );

  qc.declare("uniform", [distributionArrays],
    function(testCase, value) {
      var d = new qc.Distribution.uniform(value);
      // Get all probabilities into the array allProbs.
      var allProbs = d.data
        .reduce(function(last, cur){ // Return an array with unique values.
          if (last.indexOf(cur[0])==-1){
            return last.concat([cur[0]]);
          }
          return last;
        }, []); // Return an array with all different ones (Array.unique).
      testCase.assert(allProbs.length==1 && allProbs[0]==d.data[0][0]);
    }
  );

//*/
});
