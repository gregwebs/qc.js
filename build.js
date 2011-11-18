var fs = require('fs');
var SRC_PATH = 'src/';
var FILENAME = 'dist/qc.js';

var print = function(s){process.stdout.write(s)};
// Build qc.js, the built file.
function readSourceFile(fileName){
  return fs.readFileSync(SRC_PATH + fileName + '.js');
}

console.log('Reading source files...');
// For now we are resolving all deps manually by listing the files here :) #improvable, yo.
var files = 'Case Config '+
  'ConsoleListener HtmlListener NodeConsoleListener '+
  'Distribution Fail core Invalid Pass random Stats util '+
  'generator/base generator/number generator/string generator Prop qc';
var qcSrc = files.split(' ').map(readSourceFile).join('\n');

console.log('Stripping comments...');
qcSrc = qcSrc
  .replace(/\/\/[^\n]+\n*/g, '') // Remove // comments.
  .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, '') // Remove /**/ comments, thx to http://ostermiller.org/findcomment.html
  .replace(/\n\s*\n/g, '\n'); // Remove empty lines.


function getModuleVariableName(moduleName){
  return '__' + moduleName.replace('/', '_'); // The variable name we use for the module.
}

print('Removing require code ');
// Replace define's with function calls.
var matches = qcSrc.match(/define\('([/a-zA-Z0-9]+)'\s*(,\s*\[\s*([^\]]+)\])?/g);
for (var i=0; i<matches.length; i++){
  print('.');
  var aDefine = matches[i];
  var moduleName = aDefine.match(/define\('([^']+)/)[1];
  var moduleStartPos = qcSrc.indexOf(aDefine); // At which position in the file is our define.
  var moduleEndPos = qcSrc.slice(moduleStartPos).search(/}\);\s*define\(|}\);\s*$/g);

  // Find where the define() ended, and lets make
  //   })(Distribution, core);
  // out of this
  //   });
  // So the function that the define has become is called with
  // the according arguments, that we had found in define().
  var params = [];
  if (aDefine.indexOf('[')!=-1){
    params = aDefine.match(/^.*\[\s*'([^\]]+)/)[1].replace(/'\s*$/, '').replace(/'\s*,\s*'/g, ',');
    params = params.split(',').map(getModuleVariableName);
  }
//console.log(params)
//console.log(moduleName,moduleEndPos,moduleStartPos)
  qcSrc = qcSrc.slice(0, moduleEndPos+moduleStartPos) + '})(' + params + ');\n' +
          qcSrc.slice(moduleEndPos+moduleStartPos+3);
  qcSrc = qcSrc.replace(aDefine + ',', ';var ' + getModuleVariableName(moduleName) + '=(');
}
print('\n');

console.log('Writing file "%s"', FILENAME);
qcSrc = 'var qc = null;\n;(function(){' + qcSrc + '\nqc = __qc;\n})();';
// For making it available as node module.
qcSrc += '\nif (typeof exports!=\'undefined\') exports.qc = qc;\n';
fs.writeFile(FILENAME, qcSrc, function (err) {
  if (err) throw err;
  console.log('DONE, have a nice day!');
});

//*/
