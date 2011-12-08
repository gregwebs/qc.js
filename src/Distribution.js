define('Distribution', function() {
  /**
   * Probability distributions.
   *
   * @class
   */
  function Distribution(d) {
    this.data = addUpSameValues(d);
    this.normalize();
    this.length = this.data.length;
  }

  /**
   * Add the weights for the same values.
   * I.e. data like this:
   *    [1, 'one'], [1, 'one'], [1, 'two']
   * should be summarizes to this
   *    [2, 'one'], [1, 'two']
   */
  function addUpSameValues(data){
    var ret = [];
    if (data.length>0){
      ret[0] = [data[0][0], data[0][1]];
      for (var i=1, l=data.length; i<l; i++){
        var val = data[i][1];
        // Find it in ret, and add the weights or push it into ret.
        var wasFound = false;
        for (var j=0, l1=ret.length; j<l1; j++){
          if (val == ret[j][1]){
            ret[j][0] += data[i][0];
            wasFound = true;
            break;
          }
        }
        if (!wasFound){
          ret.push([data[i][0], data[i][1]]);
        }
      }
    }
    return ret;
  }

  /**
   * Normalize all probablities to sum up to 1.
   */
  Distribution.prototype.normalize = function () {
      var sum = 0, i;
      for (i = 0; i < this.data.length; i++) {
          sum += this.data[i][0];
      }
      for (i = 0; i < this.data.length; i++) {
          this.data[i][0] /= sum;
      }
  };

  /**
   * Get the probability of a given value in the distribution.
   *
   * @param x any value to find probability for
   * @return the probability of x in the distribution
   */
  Distribution.prototype.getProbability = function (x) {
      for (var i = 0; i < this.data.length; i++) {
          if (this.data[i][1] === x) {
              return this.data[i][0];
          }
      }
      return 0;
  };

  /**
   * finds the (first) object with the highest probability.
   *
   * @return object with highest probability
   */
  Distribution.prototype.getMostProbable = function () {
      var max = 0, ret = null, i;

      for (i = 0; i < this.data.length; i++) {
          if (this.data[i][0] > max) {
              max = this.data[i][0];
              ret = this.data[i][1];
          }
      }
      return ret;
  };

  /**
   * randomly draws a values by its probability from the distribution.
   *
   * @return any value in the distribution
   */
  Distribution.prototype.pick = function () {
      var i, r = Math.random(), s = 0;

      for (i = 0; i < this.data.length; i++) {
          s += this.data[i][0];
          if (r < s) {
              return this.data[i][1];
          }
      }
  };

  /**
   * creates a new uniform distribution from an array of values.
   *
   * @param data an array of values
   *
   * @return a new Distribution object
   */
  Distribution.uniform = function (data) {
    var ret = [];
    for (var i=0, l=data.length; i<l; i++){
      ret.push([1, data[i]]);
    }
    return new Distribution(ret);
  };

  return Distribution;
});
