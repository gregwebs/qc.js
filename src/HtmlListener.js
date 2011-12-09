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
    if (params.filterNodeId){
      renderFilterHtml(params.filterNodeId);
    }
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

  function parseQuery(){
    var link = window.location.href;
    var query = {};
    if (window.location.search){
      var parts = window.location.search.replace(/\?/, '').split('&');
      parts.forEach(function(p){
        var keyValue = p.split('=');
        query[keyValue[0]] = keyValue[1];
      });
    }
    return query;
  }

//<div>Filter the tests</div>
//<div>max passes: <span id=maxPass></span></div>
//<hr/>

  function renderFilterHtml(nodeId){
    var node = document.getElementById(nodeId);
    node.appendChild(buildTestLinks());
    node.appendChild(buildMaxPassLinks());
    node.innerHTML += '<hr/>';
  }

  function getQueryString(query){
    var ret = [];
    for (var i in query){
      ret.push(i + '=' + query[i]);
    }
    return ret.join('&');
  }

  function buildTestLinks(){
    var query = parseQuery();
    var node = document.createElement('div');
    node.innerHTML = 'filter groups: ';
    delete query.searchString;
    node.innerHTML += '<a href=?'+ getQueryString(query) +'>All tests</a> ::: ';
    qc.groupNames.sort().forEach(function(name){
      query.searchString = name;
      node.innerHTML += '<a href=?'+ getQueryString(query) +'>'+name+'</a> ';
    });
    return node;
  }

  function buildMaxPassLinks(){
    var query = parseQuery();
    var node = document.createElement('div');
    node.innerHTML = 'max passes: ';
    var maxPasses = [100, 500, 1000, 10000, 100000];
    for (var i=0; i<maxPasses.length; i++){
      query.maxPass = maxPasses[i];
      node.innerHTML += ' <a href=?'+ getQueryString(query) +'>' + maxPasses[i] + '</a> ';
    }
    return node;
  }

  return HtmlListener;
});

