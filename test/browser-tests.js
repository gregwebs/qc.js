define('browser-tests', ['qc'], function(qc){
  var searchString = window.location.search ? window.location.search.replace(/\?/, '') : '';
  var config = new qc.Config({searchString:searchString});
  require([
    '../test/UxebuCiListener',
//    '../test/random',
//    '../test/generator-base',
//    '../test/generator-string',
//    '../test/generator-number',
//    '../test/Distribution',
//    '../examples/stringSplitter',

    '../test/generator-html',

  ], function(UxebuCiListener){
    qc.runProps(config, new UxebuCiListener('testresults', true));
  });
});
