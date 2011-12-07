;(function(){
  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    main(qc);
  } else {
    define(['qc'], main);
  }

  function main(qc){
    var gen = qc.generator;

    var distributionArrays =
      gen.nonEmptyArrays( // Generate an array with at least one of the following elements.
        gen.arraysOfSize( // Generate an array with a fixed size with the two following elements.
          [
            gen.number.integerRanges(1, 1000), // First element is always a number, the probability.
            gen.string.strings() // Second element is always a string, the value.
          ]
        )
      );

    qc.declare('Distribution.getProbability', [distributionArrays],
      function(testCase, value) {
        var d = new qc.Distribution(value);
        // Sum up all probabilities.
        var probabilitySum = value.reduce(function(lastValue, arr){return arr[0]+lastValue}, 0);
        var arrIndex = qc.getPositiveInteger(value.length-1);
        var val = d.getProbability(value[arrIndex][1]);
        testCase.assert(val == value[arrIndex][0]/probabilitySum);
      }
    );

    qc.declare('Distribution.normalize', [distributionArrays],
      function(testCase, value) {
        var d = new qc.Distribution(value);
        var sum = d.data.reduce(function(last, curArr){ return last+curArr[0] }, 0);
        // Multply and round to catch 0.99999, which happens with adding up floating numbers.
        testCase.assert(Math.round(sum*100)/100 == 1);
      }
    );

    qc.declare('Distribution.getMostProbable', [distributionArrays],
      function(testCase, value) {
        var d = new qc.Distribution(value);
        var highestProbability = d.data.reduce(function(last, curArr){ return curArr[0] > last[0] ? curArr : last; }, [0]);
        // Multply and round to catch 0.99999, which happens with adding up floating numbers.
        testCase.assert(highestProbability[1] == d.getMostProbable());
      }
    );

    qc.declare('Distribution.uniform', [distributionArrays],
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

// TODO Actually this could be a jasmine test, normal unittesting :)


    qc.declare('Distribution.uniform verify multiple values\' weight gets added up', [],
      function(testCase) {
        // Just two values' weights should add up.
        var d = new qc.Distribution.uniform(['one', 'one', 'two', 'three']);
        var value2weight = {};
        d.data.forEach(function(val){ value2weight[val[1]] = val[0]; });
        testCase.assert(value2weight.one == 0.5);
        testCase.assert(value2weight.two == 0.25);
        testCase.assert(value2weight.three == 0.25);

        // Some values' weights should add up.
        var d = new qc.Distribution.uniform(['one', 'one', 'two', 'three', 'one', 'two', 'four', 'one']);
        var value2weight = {};
        d.data.forEach(function(val){ value2weight[val[1]] = val[0]; });
        testCase.assert(value2weight.one == 0.5);
        testCase.assert(value2weight.two == 0.25);
        testCase.assert(value2weight.three == 0.125);
        testCase.assert(value2weight.three == 0.125);
      }
    );
    //*/
  }
})();
