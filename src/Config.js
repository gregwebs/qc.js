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
  function Config(pass, invalid, maxShrink) {
      this.maxPass = pass;
      this.maxInvalid = invalid;
      this.maxShrink = arguments.length < 3 ? 3 : maxShrink;
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
