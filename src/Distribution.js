define(function() {
  /**
   * Probability distributions.
   *
   * @class
   */
  function Distribution(d) {

      /** @ignore */
      function incBy(data, key, x) {
          var found = false, i;
          for (i = 0; i < data.length; i++) {
              if (data[i][1] === key) {
                  data[i][0] += x;
                  found = true;
                  break;
              }
          }
          if (!found) {
              data.push([x, key]);
          }
      }

      var data = [], j;
      for (j = 0; j < d.length; j++) {
          incBy(data, d[j][1], d[j][0]);
      }

      this.data = data;
      this.normalize();
      this.length = this.data.length;
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
  Distribution.prototype.mostProbable = function () {
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
      var i, tmp = new Array(data.length);
      for (i = 0; i < data.length; i++) {
          tmp[i] = ([1, data[i]]);
      }
      return new Distribution(tmp);
  };

  return Distribution;
});