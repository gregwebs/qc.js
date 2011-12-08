var qc = require('../dist/qc.js').qc;
qc.generator.html = require('../dist/qc-generator-html.js').qc_generator_html;
require('./generator-base.js');
require('./generator-number.js');
require('./generator-string.js');
require('./Distribution.js');
require('./random.js');
require('../examples/stringSplitter');
require('../test/generator-html');

var params = {searchString:process.argv[2] || '', maxPass:200, maxShrink:3, maxShrunkArgs:100};
var config = new qc.Config(params);
qc.runProps(config, new qc.NodeConsoleListener());
