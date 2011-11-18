define(function() {
  /**
   * @class
   */
  function Invalid(prop, stats) {
      /** @field */
      this.status = 'invalid';

      this.prop = prop;
      this.stats = stats;
      this.name = prop.name;
  }

  Invalid.prototype.toString = function () {
      return 'Invalid (' + this.name + ') counts=' + this.stats;
  };

  return Invalid;
});
