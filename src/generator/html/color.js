define('generator/html/color', [
  'qc',
  'generator/html/_util'
], function(qc, util){

  var gen = qc.generator;
  var exports = {};

  exports.any = function(){
    return {
      func: function(){
        return qc.generateValue(gen.chooseGenerator(
          exports.hexColors(3),
          exports.hexColors(6),
          exports.names(),
          exports.nameUpperCases(),
          exports.nameLowerCases(),
          exports.nameRandomCases(),
          exports.rgb(),
          exports.rgbaPercent(),
          exports.rgba(),
          exports.rgbaPercent()
//          exports.hsb(),
//          exports.hsbaPercent(),
//          exports.hsba(),
//          exports.hsbaPercent()
        ));
      }
    }
  };

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
          return char[func]();
        });
        return '#' + ret.join('');
      }
    };
  };

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

  exports.rgb = function(){
    return {
      func: function(){
        var vals = [qc.getPositiveInteger(255), qc.getPositiveInteger(255), qc.getPositiveInteger(255)];
        return 'rgb(' + vals.join(',') + ')';
      }
    };
  };

  exports.rgbPercent = function(){
    return {
      func: function(){
        var vals = [qc.getPositiveInteger(100), qc.getPositiveInteger(100), qc.getPositiveInteger(100)];
        return 'rgb(' + vals.join('%,') + '%)';
      }
    };
  };

  exports.rgba = function(){
    return {
      func: function(){
        var vals = [qc.getPositiveInteger(255), qc.getPositiveInteger(255), qc.getPositiveInteger(255), qc.getPositiveFloat(1)];
        return 'rgba(' + vals.join(',') + ')';
      }
    };
  };

  exports.rgbaPercent = function(){
    return {
      func: function(){
        var vals = [qc.getPositiveInteger(100), qc.getPositiveInteger(100), qc.getPositiveInteger(100), qc.getPositiveFloat(1)];
        return 'rgba(' + vals.join('%,') + ')';
      }
    };
  };

/*  exports.hsb = function(){
    return {
      func: function(){
        var vals = [qc.getFloat(), qc.getFloat(), qc.getFloat()];
        return 'hsb(' + vals.join(',') + ')';
      }
    };
  };

  exports.hsbPercent = function(){
    return {
      func: function(){
        var vals = [qc.getPositiveInteger(100), qc.getPositiveInteger(100), qc.getPositiveInteger(100)];
        return 'hsb(' + vals.join('%,') + '%)';
      }
    };
  };

  exports.hsba = function(){
    return {
      func: function(){
        var vals = [qc.getFloat(), qc.getFloat(), qc.getFloat(), qc.getFloat()];
        return 'hsba(' + vals.join(',') + ')';
      }
    };
  };

  exports.hsbaPercent = function(){
    return {
      func: function(){
        var vals = [qc.getPositiveInteger(100), qc.getPositiveInteger(100), qc.getPositiveInteger(100), qc.getFloat()];
        return 'hsba(' + vals.join('%,') + ')';
      }
    };
  };
  //*/
  
  return exports;
});
