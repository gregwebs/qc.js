var fs = require('fs');
var SRC_PATH = 'src/';
var FILENAME = 'dist/qc.js';

// Build qc.js, the built file.
function readSourceFile(fileName){
  return fs.readFileSync(SRC_PATH + fileName + '.js');
}
var files = 'Case Config ConsoleListener Distribution Fail core Invalid Pass random Stats util '+
  'generator/base generator/number generator/string generator Prop qc';
var qcSrc = files.split(' ').map(readSourceFile).join('\n');
qcSrc = qcSrc
  .replace(/\/\/[^\n]+\n*/g, '') // Remove // comments.
  .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, '') // Remove /**/ comments, thx to http://ostermiller.org/findcomment.html
  .replace(/\n\s*\n/g, '\n'); // Remove empty lines.
fs.writeFileSync(FILENAME, qcSrc);


function getModuleVariableName(moduleName){
  return '__' + moduleName.replace('/', '_'); // The variable name we use for the module.
}

fs.readFile(FILENAME, function (err, data) {
  if (err) throw err;

  data = data.toString('utf8');
  // Replace define's with function calls.
  var matches = data.match(/define\('([/a-zA-Z0-9]+)'\s*(,\s*\[\s*([^\]]+)\])?/g);
  for (var i=0; i<matches.length; i++){
    var aDefine = matches[i];
    var moduleName = aDefine.match(/define\('([^']+)/)[1];
    var moduleStartPos = data.indexOf(aDefine); // At which position in the file is our define.
    var moduleEndPos = data.slice(moduleStartPos).search(/}\);\s*define\(|}\);\s*$/g);
    
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
    data = data.slice(0, moduleEndPos+moduleStartPos) + '})(' + params + ');\n' +
            data.slice(moduleEndPos+moduleStartPos+3);
    data = data.replace(aDefine + ',', ';var ' + getModuleVariableName(moduleName) + '=(');
  }

  data = 'var qc = null;\n;(function(){' + data + '\nqc = __qc;\n})();';
  fs.writeFile(FILENAME, data, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
});

//*/
