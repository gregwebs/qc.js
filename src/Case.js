define('Case', function() {
  /**
   * The Test Case class generated every time a property is tested.
   * An instance of Case is always passed as first argument to a property's
   * testing function so users can control the test case's properties.
   *
   * @class
   */
  function Case(args) {
      this.tags = [];
      this.collected = [];
      this.args = args;
  }

  /**
   * Tests and notifies QuickCheck if a property fails or not.
   *
   * @param bool pass false, if property failed
   */
  Case.prototype.assert = function (bool) {
    if (!bool) {
      throw ('AssertFailed');
    }
  };

  /**
   * Used to test if input is good for testing the property.
   *
   * @param bool pass false to mark property as invalid for given input.
   */
  Case.prototype.guard = function (bool) {
    if (!bool) {
      throw ('InvalidCase');
    }
  };

  /**
   * Adds a tag to a test case.
   *
   * @param tag value to add
   */
  Case.prototype.addTag = function (tag) {
    this.tags.push(tag);
  };

  /**
   * Collect builds a histogram of all collected values for all runs of the
   * property.
   *
   * @param value value to collect
   */
  Case.prototype.collect = function (value) {
    var found = false;
    for (var i = 0; i < this.collected.length; i++) {
      if (this.collected[i][1] === value) {
        this.collected[i][0] += 1;
        found = true;
        break;
      }
    }
    if (!found) {
      this.collected.push([1, value]);
    }
  };

  /**
   * Adds the given value to the test case its values for reporting in case of
   * failure.
   *
   * @param value The value to add.
   */
  Case.prototype.noteArg = function (value) {
    this.args.push(value);
  };
  
  return Case;
});
