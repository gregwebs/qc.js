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

    var regexps = {
      hexUpperCase3: /#[A-Z0-9]{3}/,
      hexUpperCase6: /#[A-Z0-9]{6}/,
      hexLowerCase3: /#[a-z0-9]{3}/,
      hexLowerCase6: /#[a-z0-9]{6}/,
      hexMixedCase3: /#[a-zA-Z0-9]{3}/,
      hexMixedCase6: /#[a-zA-Z0-9]{6}/,
      rgb: /rgb\(\d+,\d+,\d+\)/,
      rgbPercent: /rgb\(\d+%,\d+%,\d+%\)/,
      rgba: /rgba\(\d+,\d+,\d+,[01]\.\d+\)/,
      rgbaPercent: /rgba\(\d+%,\d+%,\d+%,[01]\.\d+\)/,
      names: /[a-zA-Z]+/,
      nameUpperCases: /[A-Z]+/,
      nameLowerCases: /[a-z]+/,
      nameRandomCases: /[a-z]+/
    };

    qc.declare("any possible kind of colors", [htmlColorGenerator.any()],
      function(testCase, value){
        var matchFound = false;
        for (var i in regexps){
          if (!!value.match(regexps[i])){
            matchFound = true;
            break;
          }
        }
        testCase.assert(matchFound);
      }
    );

    qc.declare("hex upper cases, 3 digits", [htmlColorGenerator.hexUpperCases(3)],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.hexUpperCase3));
      }
    );

    qc.declare("hex upper cases, 6 digits", [htmlColorGenerator.hexUpperCases(6)],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.hexUpperCase6));
      }
    );

    qc.declare("hex lower cases, 3 digits", [htmlColorGenerator.hexLowerCases(3)],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.hexLowerCase3));
      }
    );

    qc.declare("hex lower cases, 6 digits", [htmlColorGenerator.hexLowerCases(6)],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.hexLowerCase6));
      }
    );

    qc.declare("hex mixed cases, 3 digits", [htmlColorGenerator.hexMixedCases(3)],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.hexMixedCase3));
      }
    );

    qc.declare("hex mixed cases, 6 digits", [htmlColorGenerator.hexMixedCases(6)],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.hexMixedCase6));
      }
    );

    qc.declare("hex 6 digits", [htmlColorGenerator.hexColors(6)],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.hexMixedCase6));
      }
    );

    qc.declare("hex 3 digits", [htmlColorGenerator.hexColors(3)],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.hexMixedCase3));
      }
    );

    qc.declare("names", [htmlColorGenerator.names()],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.names));
      }
    );

    qc.declare("names lower case", [htmlColorGenerator.nameLowerCases()],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.nameLowerCases));
      }
    );

    qc.declare("names upper case", [htmlColorGenerator.nameUpperCases()],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.nameUpperCases));
      }
    );

    qc.declare("names random cases", [htmlColorGenerator.nameRandomCases()],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.nameRandomCases));
      }
    );

    qc.declare("rgb(0..255, 0..255, 0..255)", [htmlColorGenerator.rgb()],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.rgb));
      }
    );

    qc.declare("rgb(0..100%, 0..100%, 0..100%)", [htmlColorGenerator.rgbPercent()],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.rgbPercent));
      }
    );

    qc.declare("rgba(0..255, 0..255, 0..255, 0..1)", [htmlColorGenerator.rgba()],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.rgba));
      }
    );

    qc.declare("rgba(0..100%, 0..100%, 0..100%, 0..1)", [htmlColorGenerator.rgbaPercent()],
      function(testCase, value){
        testCase.assert(!!value.match(regexps.rgbaPercent));
      }
    );

/*    qc.declare("hsb(0..1, 0..1, 0..1)", [htmlColorGenerator.hsb()],
      function(testCase, value){
        testCase.assert(!!value.match(/hsb\([01]\.\d+,[01]\.\d+,[01]\.\d+\)/));
      }
    );

    qc.declare("hsb(0..100%, 0..100%, 0..100%)", [htmlColorGenerator.hsbPercent()],
      function(testCase, value){
        testCase.assert(!!value.match(/hsb\(\d+%,\d+%,\d+%\)/));
      }
    );

    qc.declare("hsba(0..1, 0..1, 0..1, 0..1)", [htmlColorGenerator.hsba()],
      function(testCase, value){
        testCase.assert(!!value.match(/hsba\([01]\.\d+,[01]\.\d+,[01]\.\d+\,[01]\.\d+\)/));
      }
    );

    qc.declare("hsba(0..100%, 0..100%, 0..100%, 0..1)", [htmlColorGenerator.hsbaPercent()],
      function(testCase, value){
        testCase.assert(!!value.match(/hsba\(\d+%,\d+%,\d+%,[01]\.\d+\)/));
      }
    );

    //*/
  }
})();
