define(function() {
  var exports = {};
  
  exports.randWhole = function(top) {
      return Math.floor(Math.random() * top);
  }

  exports.randInt = function(top) {
      return randWhole(2 * top) - top;
  }

  exports.randRange = function(a, b) {
      return randWhole(b - a) + a;
  }

  exports.randFloatUnit = function() {
      return Math.random();
  }

  return exports;
});