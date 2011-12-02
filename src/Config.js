define('Config', function() {
  /**
   * Testing Configuration.
   *
   * @param pass maximum passes per property
   * @param invalid maximum invalid tests per property
   * @param maxShrink maximum number of shrinking steps per property
   *
   * @class
   */
  function Config(params) {
    this.maxPass = params.pass || 100;
    this.maxInvalid = params.invalid || 10;
    this.maxShrink = typeof params.maxShrink == 'undefined' ? 3 : params.maxShrink;
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
