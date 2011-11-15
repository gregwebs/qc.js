define([
  'ConsoleListener'
],function(ConsoleListener) {
  /**
   * QuickCheck callback for FireBug sending property results to FireBug's
   * console
   *
   * @extends ConsoleListener
   * @class
   */
  function HtmlListener(nodeId) {
    this.maxCollected = 0;
    this._domNode = document.getElementById(nodeId);
  }
  HtmlListener.prototype = new ConsoleListener();
  HtmlListener.prototype.passed = function (str) {
      this._domNode.innerHTML += str.status + ': ' + str.name + ' -- ' + JSON.stringify(str.stats) + '<br>';
  }
  HtmlListener.prototype.invalid = function (str) {
    this._domNode.innerHTML += str.status + ': ' + str.name + '<br>';
  };
  HtmlListener.prototype.failure = function (str) {
    this._domNode.innerHTML += str.status + ': ' + str.name + '<br>';
  };
  HtmlListener.prototype.log = function (str) {
    console.log(str);
  }

  return HtmlListener;
});

