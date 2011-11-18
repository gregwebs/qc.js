var qc = require('../dist/qc.js').qc;
require('./generator-base.js');
require('./generator-number.js');
require('./generator-string.js');
require('./Distribution.js');
require('./random.js');

var config = new qc.Config(100, 10, 100);
qc.runAllProps(config, new qc.ConsoleListener());
