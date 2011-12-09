define('Pass', function() {
  /**
   * Report class for successful tested properties.
   *
   * @class
   */
  function Pass(prop, stats) {
      /** status = "pass" */
      this.status = 'pass';

      /** the property this object was build for.*/
      this.prop = prop;

      /** property run statistics.*/
      this.stats = stats;

      /** The property its name.*/
      this.name = prop.name;
      this.groupName = prop.groupName;
  }

  Pass.prototype.toString = function () {
      return 'Pass (' + this.name + ') counts=' + this.stats;
  };

  return Pass;
});

