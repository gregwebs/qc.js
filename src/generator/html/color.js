define([
  'qc',
  'generator/html/_util'
], function(qc, util){

  var gen = qc.generator;
  var exports = {};

  exports.hexUpperCases = function(size){
    return {
      func: function(){
        return qc.generateValue(util.getHexNumber(size)).toUpperCase();
      }
    };
  };

  exports.hexLowerCases = function(size){
    return {
      func: function(){
        return qc.generateValue(util.getHexNumber(size)).toLowerCase();
      }
    };
  };

  exports.hexMixedCases = function(size){
    return {
      func: function(){
        var ret = qc.generateValue(util.getHexNumber(size));
        // Convert each letter randomly to upper or lower case.
        ret = ret.split('').map(function(char){
          // Mix upper and lower case randomly.
          var func = Math.round(Math.random()) ? 'toLowerCase' : 'toUpperCase';
          return char[func]()
        });
        return ret.join('');
      }
    };
  };

  exports.colorNames = util.getRandomColorName();

  exports.hexColors = function(size){
    return {
      func: function(){
        return qc.generateValue(
          gen.chooseGenerator(
            exports.hexLowerCases(size),
            exports.hexUpperCases(size),
            exports.hexMixedCases(size)
          )
        );
      }
    };
  };

  exports.colors = qc.generateValue(
    gen.chooseGenerator(
      exports.hexColors(3),
      exports.hexColors(6)
//      exports.colorNames()
    )
  );

  return exports;
});
