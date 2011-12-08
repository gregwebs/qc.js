var fs = require('fs');
var SRC_PATH = '../src/';

/**
 * Print a single character without a newline after it.
 * @param s
 */
function printWithoutNewline(s){
  process.stdout.write(s)
}

function readSourceFile(fileName){
  return fs.readFileSync(SRC_PATH + fileName + '.js');
}

function getModuleVariableName(moduleName){
  return '__' + moduleName.replace(/\//g, '_'); // The variable name we use for the module.
}

exports.readSource = function(inputFiles){
  printWithoutNewline('Reading, ');
  // For now we are resolving all deps manually by listing the files here :) #improvable, yo.
  return inputFiles.map(readSourceFile).join('\n');
}

exports.stripComments = function(src){
  printWithoutNewline('Stripping, ');
  src = src
    // Make sure to remove /*..*/ first so we dont get trapped by my speciality '//*/' :)
    .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, '') // Remove /**/ comments, thx to http://ostermiller.org/findcomment.html
    .replace(/\/\/[^\n]+\n*/g, '') // Remove // comments.
    .replace(/\n\s*\n/g, '\n'); // Remove empty lines.
  return src;
}

/**
 * Convert from require-based code to simple functions.
 * And add node style require compatible code and browser based require code at the end.
 */
exports.convert = function(src){
  printWithoutNewline('Converting ');
  // Replace define's with function calls.
  var matches = src.match(/define\('([/a-zA-Z0-9_]+)'\s*(,\s*\[\s*([^\]]+)\])?/g);
  if (!matches){
    throw('ERROR, define() may be missing the module name. Can\'t process files.');
  } else {
    for (var i=0; i<matches.length; i++){
      printWithoutNewline('.');
      var aDefine = matches[i];
      var moduleName = aDefine.match(/define\('([^']+)/)[1];
      var moduleStartPos = src.indexOf(aDefine); // At which position in the file is our define.
      var moduleEndPos = src.slice(moduleStartPos).search(/}\);\s*define\(|}\);\s*$/g);

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
      src = src.slice(0, moduleEndPos+moduleStartPos) + '})(' + params + ');\n' +
            src.slice(moduleEndPos+moduleStartPos+3);
      src = src.replace(aDefine + ',', ';var ' + getModuleVariableName(moduleName) + '=(');
    }
  }
  return src;
}

exports.writeFile = function(data, outputFile){
  printWithoutNewline(' Writing "' + outputFile + '"\n\n');
  fs.writeFile(outputFile, data, function (err) {
    if (err) throw err;
    console.log('Done writing "%s"', outputFile);
  });
}

//*/
