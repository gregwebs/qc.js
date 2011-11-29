var build = require('./_build.js');

exports.main = function(){
  var inputFiles = require('./build-targets/core-files.js').files;
  var outputFile = '../dist/qc.js';

  var qcSrc = build.convert(build.stripComments(build.readSource(inputFiles)));

  qcSrc = 'var qc = null;\n;(function(){' + qcSrc + '\nqc = __qc;\n})();';
  // For making it available as node module.
  qcSrc += '\nif (typeof exports!=\'undefined\') exports.qc = qc;\n';
  // To define it for browser based require's.
  qcSrc += 'if (typeof define!=\'undefined\') define(\'qc\', function(){return qc});\n';

  build.writeFile(qcSrc, outputFile);
}
exports.main();
