define(function() {
  /**
   * @class
   */
  function Fail(prop, stats, failedCase, shrinkedArgs) {
      this.status = "fail";
      this.prop = prop;
      this.stats = stats;
      this.failedCase = failedCase;
      this.shrinkedArgs = shrinkedArgs;
      this.name = prop.name;
  }

  Fail.prototype.toString = function () {
      function tagstr(tags) {
          var str, i;

          if (!tags || tags.length === 0) {
              return "";
          }

          str = "(tags: " + tags[0];
          for (i = 1; i < tags.length; i++) {
              str += ", " + tags[i];
          }
          return str + ")";
      }

      function shrinkstr(arg) {
          return arg === null ? "" : "\nminCase: " + arg;
      }

      return this.name + tagstr(this.stats.tags) +
             " failed with: counts=" + this.stats +
             " failedCase: " + this.failedCase +
             shrinkstr(this.shrinkedArgs);
  };

  return Fail;
});