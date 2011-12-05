define('HtmlListener', [
  'ConsoleListener'
], function(ConsoleListener) {
  /**
   * QuickCheck callback for FireBug sending property results to FireBug's
   * console
   *
   * @extends ConsoleListener
   * @class
   */
  function HtmlListener(params) {
    this.maxCollected = 0;
    this._showPassedTests = params.showPassedTests || true;
    this._domNode = document.getElementById(params.nodeId);
  }
  HtmlListener.prototype = new ConsoleListener();
  HtmlListener.prototype.passed = function (str) {
    if (this._showPassedTests) {
//      this._domNode.innerHTML += str.status + ': ' + str.name + ' -- ' + JSON.stringify(str.stats) + '<br>';
      this._domNode.innerHTML += str + '<br>';
    }
  };
  HtmlListener.prototype.invalid = function (str) {
    this._domNode.innerHTML += str + '<br>';
  };
  HtmlListener.prototype.failure = function (str) {
    this._domNode.innerHTML += str + '<br>';
  };
  HtmlListener.prototype.log = function (str) {
    this._domNode.innerHTML += str + '<br>';
  };
  HtmlListener.prototype.done = function (str) {
    this._domNode.innerHTML += 'DONE.';
  };

  return HtmlListener;
});

