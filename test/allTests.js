define('allTests', ['qc'], function(qc){
  var config = new qc.Config(100, 10, 100);
  require([
    '../test/UxebuCiListener',
    '../test/random',
    '../test/generator-base',
    '../test/generator-string',
    '../test/generator-number',
    '../test/Distribution',
    '../examples/stringSplitter',
  ], function(UxebuCiListener){
    qc.runAllProps(config, new UxebuCiListener('testresults', true));
  });
});
