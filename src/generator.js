define('generator', [
  'generator/base',
  'generator/number',
  'generator/string',
], function(base, number, string) {

  // Populate the following using their namespaces.
  // So they will be reachable via 'qs.generator.*'
  var modules = {
    'number': number,
    'string': string
  };

  // Populate all functions from base straight into the 'generator' namespace.
  for (var i in base){
    modules[i] = base[i];
  }

  return {generator:modules};
});
