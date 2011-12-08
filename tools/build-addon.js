var build = require('./_build.js');

// Call i.e. like this, to build a separate file to contain
// only the qc.generator.html namespace:
//   node build-addon.js ./build-targets/generator-html-files.js ./dist/qc-generator-html.js qc.generator.html

exports.main = function(inputFiles, outputFile, targetNamespace){
  var inputFiles = require(inputFiles).files;
  var nodeVarName = targetNamespace.replace(/\./g, '_');
  var varName = '__' + nodeVarName.replace(/^qc_/, '') + '___all__';
  var src = build.convert(build.stripComments(build.readSource(inputFiles)));
  // Add the addon into the given namespace.
  src = ';(function(){\n' +
        'if (typeof exports!=\'undefined\') {'+
        '  var __qc = require(\'./qc.js\').qc;'+
        '} else {'+
        '  var __qc = qc;'+
        '}'+
          src + '\n' +
        'if (typeof exports==\'undefined\') {' +
          targetNamespace + ' = ' + varName + ';' +
        '} else {' +
        '  exports.'+ nodeVarName +' = __generator_html___all__;' +
        '}' +
        '})();';

  build.writeFile(src, outputFile);
}

if (process.argv.length == 3){
  // If called from the command line build what is given.
  var inputFiles = process.argv[2];
  var outputFile = process.argv[3];
  var targetNamespace = process.argv[4];
  exports.main(inputFiles, outputFile, targetNamespace);
} else {
  var addons = [
    './build-targets/generator-html-files.js ../dist/qc-generator-html.js qc.generator.html'.split(' ')
  ];
  addons.forEach(function(addon){
    exports.main.apply(null, addon);
  });
}
