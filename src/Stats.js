define('Stats', [
  'Pass', 'Invalid'
],function(Pass, Invalid) {
  /**
   * Statistics class for counting number of pass/invalid runs, building
   * histograms and other statistics for reporting a property its testing
   * results.
   *
   * @class
   */
  function Stats() {
    this.counts = {
      pass:0,
      invalid:0,
      fail:0
    };
    this.shrinkCounts = {
      pass:0,
      invalid:0,
      fail:0
    };
    this.results = [];
    this.shrinkResults = [];

    /**
     * List of tags (created by calling Case.classify) with counts.
     * @field
     */
    this.tags = [];
    /**
     * Histogram of collected values (create by calling Case.collect)
     * @field
     */
    this.collected = null;

    this.addInvalid = function(args){
      this.counts.invalid++;
      this.results.push({result:'invalid', args:args});
    };
    this.addPass = function(args){
      this.counts.pass++;
      this.results.push({result:'pass', args:args});
    };
    this.addFail = function(args){
      this.counts.fail++;
      this.results.push({result:'fail', args:args});
    };
    this.addShrinkInvalid = function(args){
      this.shrinkCounts.invalid++;
      this.shrinkResults.push({result:'invalid', args:args});
    };
    this.addShrinkPass = function(args){
      this.shrinkCounts.pass++;
      this.shrinkResults.push({result:'pass', args:args});
    };
    this.addShrinkFail = function(args){
      this.shrinkCounts.fail++;
      this.shrinkResults.push({result:'fail', args:args});
    };

    this.addTags = function (ts) {
      var i, j, tag, found;

      for (i = 0; i < ts.length; i++) {
        tag = ts[i];
        found = false;
        for (j = 0; j < this.tags.length; j++) {
          if (this.tags[j][1] === tag) {
            found = true;
            this.tags[j][0] += 1;
          }
        }
        if (!found) {
          this.tags.push([1, tag]);
        }
      }
    };

    this.newResult = function (prop) {
      if (this.counts.pass > 0) {
        return new Pass(prop, this);
      } else {
        return new Invalid(prop, this);
      }
    };

    this.toString = function () {
      return '(pass=' + this.counts.pass + ', invalid=' + this.counts.invalid + ')';
    };
  };

  return Stats;
});
