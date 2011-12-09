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

  function getResultHtml(result){
    var html = '<b>$result:</b> $groupName: $name --- $passesx Pass, $failsx Fail, $invalidsx Invalids<br/>';
    html = html.replace('$result', result.status.toUpperCase());
    html = html.replace('$groupName', result.groupName);
    html = html.replace('$name', result.name);
    html = html.replace('$passes', result.stats.counts.pass);
    html = html.replace('$fails', result.stats.counts.fail);
    html = html.replace('$invalids', result.stats.counts.invalid);
    return html;
  }

  HtmlListener.prototype.passed = function (result) {
    if (this._showPassedTests) {
      this._domNode.innerHTML += getResultHtml(result);
    }
  };
  HtmlListener.prototype.invalid = function (result) {
    this._domNode.innerHTML += getResultHtml(result);
  };
  HtmlListener.prototype.failure = function (result) {
    var html = getResultHtml(result) + 'Failed with<pre>$failedCase</pre>';
    html = html.replace('$failedCase', JSON.stringify(result.failedCase));
    this._domNode.innerHTML += html;
  };
  HtmlListener.prototype.log = function (str) {
    this._domNode.innerHTML += str + '<br>';
  };
  HtmlListener.prototype.done = function (str) {
    this._domNode.innerHTML += 'DONE.';
  };

  return HtmlListener;
});

