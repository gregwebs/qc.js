define('FBCListener', [
  'ConsoleListener'
],function(ConsoleListener) {
  /**
   * QuickCheck callback for FireBug sending property results to FireBug's
   * console
   *
   * @extends ConsoleListener
   * @class
   */
  function FBCListener(maxCollected) {
      this.maxCollected = maxCollected || 0;
  }
  FBCListener.prototype = new ConsoleListener();
  FBCListener.prototype.passed = function (str) {
      console.log(str);
  };
  FBCListener.prototype.invalid = function (str) {
      console.warn(str);
  };
  FBCListener.prototype.failure = function (str) {
      console.error(str);
  };
  FBCListener.prototype.log = function (str) {
      console.log(str);
  };

  return FBCListener;
});

