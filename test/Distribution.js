define([
  'qc'
],function(qc){

  var gen = qc.generator;

//  var distributionData = [[1, 'one'], [2, 'two'], [7, 'three']];

//  qc.declare("getProbablity", [gen.chooseValue.apply(null, distributionData)],
  var distributionDataGenerator = gen.nonEmptyArrays(gen.arraysOfSize([gen.number.positiveIntegers, gen.string.strings]));
  qc.declare("getProbablity", [distributionDataGenerator],
    function(testCase, value) {
console.log('jooo', JSON.stringify(value));
      var d = new qc.Distribution(value);
      // Sum up all probabilities.
      var probabilitySum = value.reduce(function(lastValue, arr){return arr[0]+lastValue}, 0);
      var arrIndex = qc.getInteger(value.length);
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
