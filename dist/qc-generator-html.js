;(function(){
if (typeof exports!='undefined') {  var __qc = require('./qc.js').qc;} else {  var __qc = qc;};var __generator_html__util=( function(qc){
  var exports = {};
  exports.getHexNumber = function(length){
    var generator = function(){
      var vals = [];
      for (var i=0; i<Math.ceil(length/2); i++){ vals.push(qc.getPositiveInteger(255)); };
      var digits = vals.map(function(val){ return ('0' + val.toString(16)).slice(-2); }).join('');
      return digits.slice(0, length);
    };
    return { func:generator };
  };
  var colorNames = [
    'Aqua', 'Aquamarine',
    'Blue', 'BlueViolet',
    'CadetBlue', 'Chartreuse', 'Coral', 'CornflowerBlue', 'Crimson', 'Cyan',
    'DarkBlue', 'DarkCyan', 'DarkGreen', 'DarkKhaki', 'DarkMagenta',
    'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon',
    'DarkSeaGreen', 'DarkSlateBlue', 'DarkTurquoise', 'DarkViolet',
    'DeepPink', 'DeepSkyBlue', 'DodgerBlue',
    'FireBrick', 'ForestGreen', 'Fuchsia',
    'Gold', 'Green', 'GreenYellow',
    'HotPink',
    'IndianRed',
    'Indigo',
    'Khaki',
    'Lavender', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan',
    'LightGoldenrodYellow', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSalmon',
    'LightSeaGreen', 'LightSkyBlue', 'LightSteelBlue', 'LightYellow', 'Lime',
    'LimeGreen',
    'Magenta', 'MediumAquamarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple',
    'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise',
    'MediumVioletRed', 'MidnightBlue', 'Moccasin',
    'Navy',
    'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid',
    'PaleGoldenrod', 'PaleGreen', 'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip',
    'PeachPuff', 'Pink', 'Plum', 'PowderBlue', 'Purple',
    'Red', 'RoyalBlue',
    'Salmon', 'SeaGreen', 'SkyBlue', 'SlateBlue', 'SpringGreen', 'SteelBlue',
    'Teal', 'Thistle', 'Tomato', 'Turquoise',
    'Violet',
    'Yellow', 'YellowGreen'
  ];
  exports.getRandomColorName = function(){
    var generator = function(){
      var len = colorNames.length;
      var index = Math.round(Math.random() * (len-1));
      return colorNames[index];
    };
    return { func:generator };
  };
  return exports;
})(__qc);

;var __generator_html_color=( function(qc, util){
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
                ret = ret.split('').map(function(char){
                    var func = Math.round(Math.random()) ? 'toLowerCase' : 'toUpperCase';
          return char[func]();
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
    )
  );
  return exports;
})(__qc,__generator_html__util);

;var __generator_html___all__=( function(color) {
      var exports = {
    color: color
  };
  return exports;
})(__generator_html_color);


if (typeof exports=='undefined') {qc.generator.html = __generator_html___all__;} else {  exports.qc_generator_html = __generator_html___all__;}})();