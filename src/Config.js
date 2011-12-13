define('Config', function() {
  /**
   * Testing Configuration.
   *
   * @param params {Object}
   *          maxPass - maximum passes per property
   *          maxInvalid - maximum invalid tests per property
   *          maxShrink - Maximum number of shrinking steps per property.
   *            This value if set to 1 means that shrink is called once and uses all combinations
   *            of args that it returns to try the tests again. If the value is 2
   *            all failed tests will result in a new shrink call, that means every
   *            failing arg is passed to shrink and generates new args to try it with, which
   *            might be already a huge amount of tests, depending on the number of generators
   *            passed to the property.
   *          maxShrunkArgs - The maximum number of shrunk args combinations derived from all shrink methods of all args.
   *          searchString - Search the test name for the matching string or regular expression.
   *
   * @class
   */
  function Config(params) {
    this.maxPass = params.maxPass || 100;
    this.maxInvalid = params.maxInvalid || 10;
    this.maxShrink = parseInt(params.maxShrink) || 1;
    this.maxShrunkArgs = parseInt(params.maxShrunkArgs) || 100;
    this.searchString = params.searchString || '';
    if (params.allowConfigByUrlParams && window.location.search){
      var parts = window.location.search.replace(/\?/, '').split('&');
      var self = this;
      parts.forEach(function(p){
        var keyValue = p.split('=');
        if (typeof self[keyValue[0]] != 'undefined') self[keyValue[0]] = decodeURIComponent(keyValue[1]);
      });
    }
  }

  /**
   * tests if runloop should continue testing a property based
   * on test statistics to date.
   *
   * @private
   */
  Config.prototype.needsWork = function (numPass, numInvalid) {
      return numInvalid < this.maxInvalid &&
          numPass < this.maxPass;
  };

  return Config;
});
