;(function(){

  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    var qc_generator_html = require('../dist/qc-generator-html.js').qc_generator_html;
    main(qc, qc_generator_html.color);
  } else {
    define([
      'qc',
      'generator/html/color'
    ], main);
  }

  function main(qc, htmlColorGenerator){

    qc.declare("all possible kind of colors", [htmlColorGenerator.colorNames],
      function(testCase, value){
        testCase.assert(!!value.match(/[A-Z0-9]{3,6}|[A-Za-z]+/));
      }
    );

    // hexUpperCase
    qc.declare("hex upper cases, 3 digits", [htmlColorGenerator.hexUpperCases(3)],
      function(testCase, value){
        testCase.assert(!!value.match(/[A-Z0-9]{3}/));
      }
    );

    qc.declare("hex upper cases, 6 digits", [htmlColorGenerator.hexUpperCases(6)],
      function(testCase, value){
        testCase.assert(!!value.match(/[A-Z0-9]{6}/));
      }
    );

    // hexLowerCase
    qc.declare("hex lower cases, 3 digits", [htmlColorGenerator.hexLowerCases(3)],
      function(testCase, value){
        testCase.assert(!!value.match(/[a-z0-9]{3}/));
      }
    );

    qc.declare("hex lower cases, 6 digits", [htmlColorGenerator.hexLowerCases(6)],
      function(testCase, value){
        testCase.assert(!!value.match(/[a-z0-9]{6}/));
      }
    );

    // hexMixedCase
    qc.declare("hex mixed cases, 3 digits", [htmlColorGenerator.hexMixedCases(3)],
      function(testCase, value){
        testCase.assert(!!value.match(/[a-zA-Z0-9]{3}/));
      }
    );

    qc.declare("hex mixed cases, 6 digits", [htmlColorGenerator.hexMixedCases(6)],
      function(testCase, value){
        testCase.assert(!!value.match(/[a-zA-Z0-9]{6}/));
      }
    );

    // hexColors
    qc.declare("htmlColor 6 digits", [htmlColorGenerator.hexColors(6)],
      function(testCase, value){
        testCase.assert(!!value.match(/[a-zA-Z0-9]{6}/));
      }
    );

    qc.declare("htmlColor 3 digits", [htmlColorGenerator.hexColors(3)],
      function(testCase, value){
        testCase.assert(!!value.match(/[a-zA-Z0-9]{3}/));
      }
    );
    //*/
  }
})();
