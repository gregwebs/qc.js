define('browser-tests', ['qc'], function(qc){
  
  var params = {searchString:'', maxPass:100, maxShrink:3, maxShrunkArgs:100};
  if (window.location.search){
    var parts = window.location.search.replace(/\?/, '').split('&');
    var vals = parts.forEach(function(p){
      var keyValue = p.split('=');
      if (typeof params[keyValue[0]] != 'undefined') params[keyValue[0]] = keyValue[1];
    });
  }
console.log(params);
  var config = new qc.Config(params);
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
