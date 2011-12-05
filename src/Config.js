define('Config', function() {
  /**
   * Testing Configuration.
   *
   * @param params {Object}
   *          maxPass - maximum passes per property
   *          maxInvalid - maximum invalid tests per property
   *          maxShrink - maximum number of shrinking steps per property
   *          maxShrunkArgs - The maximum number of shrunk args combinations derived from all shrink methods of all args.
   *          searchString - Search the test name for the matching string or regular expression.
   *
   * @class
   */
  function Config(params) {
    this.maxPass = params.maxPass || 100;
    this.maxInvalid = params.maxInvalid || 10;
    this.maxShrink = typeof params.maxShrink == 'undefined' ? 3 : params.maxShrink;
    this.maxShrunkArgs = typeof params.maxShrunkArgs == 'undefined' ? 100 : params.maxShrunkArgs;
    this.searchString = params.searchString || '';
  }

  /**
   * tests if runloop should continue testing a property based
   * on test statistics to date.
   *
   * @private
   */
  Config.prototype.needsWork = function (count) {
      return count.invalid < this.maxInvalid &&
          count.pass < this.maxPass;
  };

  return Config;
});
