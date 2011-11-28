var qc = require('../dist/qc.js').qc;
qc.generator.html = require('../dist/qc-generator-html.js').qc_generator_html;
require('./generator-base.js');
require('./generator-number.js');
require('./generator-string.js');
require('./Distribution.js');
require('./random.js');
require('../examples/stringSplitter');
require('../test/generator-html');

var config = new qc.Config(100, 10, 100);
qc.runAllProps(config, new qc.NodeConsoleListener());
