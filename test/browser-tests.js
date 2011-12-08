define('browser-tests', ['qc'], function(qc){
  
  var config = new qc.Config({allowConfigByUrlParams:true});
  require([
    '../test/UxebuCiListener',
    '../test/random',
    '../test/generator-base',
    '../test/generator-string',
    '../test/generator-number',
    '../test/Distribution',
    '../examples/stringSplitter',

    '../test/generator-html',

  ], function(UxebuCiListener){
    qc.runProps(config, new UxebuCiListener({nodeId:'testresults', showPassedTests:true}));
  });
});
