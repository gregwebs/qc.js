define([
  'qc',
  'generator/html/_util'
], function(qc, util){

  var gen = qc.generator;
  var exports = {};

  exports.hexUpperCases = function(size){
    return {
      func: function(){
        return '#' + util.getHexNumber(size).toUpperCase();
      }
    };
  };

  exports.hexLowerCases = function(size){
    return {
      func: function(){
        return '#' + util.getHexNumber(size).toLowerCase();
      }
    };
  };

  exports.hexMixedCases = function(size){
    return {
      func: function(){
        var ret = util.getHexNumber(size);
        // Convert each letter randomly to upper or lower case.
        ret = ret.split('').map(function(char){
          // Mix upper and lower case randomly.
          var func = Math.round(Math.random()) ? 'toLowerCase' : 'toUpperCase';
          return char[func]()
        });
        return '#' + ret.join('');
      }
    };
  };

  exports.names = function(){
    return {
      func: function(){
        return util.getRandomColorName();
      }
    };
  };

  exports.nameUpperCases = function(){
    return {
      func: function(){
        return util.getRandomColorName().toUpperCase();
      }
    };
  };

  exports.nameLowerCases = function(){
    return {
      func: function(){
        return util.getRandomColorName().toLowerCase();
      }
    }
  };

  exports.nameRandomCases = function(){
    return {
      func: function(){
        return util.getRandomColorName()
          .split('')
          .map(function(s){return s['to'+(Math.random()>0.5?'Upper':'Lower')+'Case']()})
          .join('');
      }
    }
  };

  exports.hexColors = function(size){
    return {
      arb: function(){
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

  exports.any = function(){
    return {
      func: function(){
        return qc.generateValue(gen.chooseGenerator(
          exports.hexColors(3),
          exports.hexColors(6),
          exports.names(),
          exports.nameUpperCases(),
          exports.nameLowerCases(),
          exports.nameRandomCases()
        ));
      }
    }
  };

  return exports;
});
