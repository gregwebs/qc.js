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
  function HtmlListener(nodeId, showPasses) {
    this.maxCollected = 0;
    this._showPasses = showPasses;
    this._domNode = document.getElementById(nodeId);
  }
  HtmlListener.prototype = new ConsoleListener();
  HtmlListener.prototype.passed = function (str) {
    if (this._showPasses) {
      this._domNode.innerHTML += str.status + ': ' + str.name + ' -- ' + JSON.stringify(str.stats) + '<br>';
    }
  };
  HtmlListener.prototype.invalid = function (str) {
    this._domNode.innerHTML += str;
  };
  HtmlListener.prototype.failure = function (str) {
    this._domNode.innerHTML += str + '<br>';
  };
  HtmlListener.prototype.log = function (str) {
    this._domNode.innerHTML += str;
  };
  HtmlListener.prototype.done = function (str) {
    this._domNode.innerHTML += 'DONE.';
  };

  return HtmlListener;
});

