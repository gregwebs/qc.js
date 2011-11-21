define('NodeConsoleListener', [
  'ConsoleListener'
], function(ConsoleListener) {
  function NodeConsoleListener(){
    ConsoleListener.apply(this, arguments); // Call the parent constructor.
  };
  NodeConsoleListener.prototype = new ConsoleListener();
  NodeConsoleListener.prototype.passed = function (result) {
    process.stdout.write('\033[32m.\033[0m'); // a green dot
  };
  NodeConsoleListener.prototype.done = function () {
    console.log('\nDONE.');
  };
  // Still a problem, failure doesnt get much info passed, so its output is pretty useless :(.
  NodeConsoleListener.prototype.failure = function (result) {
    console.log('\n\033[31mFAIL\033[0m', JSON.stringify(result).slice(0, 50));
  };
  // The following two are pretty verbose, so make the shut up.
  NodeConsoleListener.prototype.log = function (result) {
  };
  NodeConsoleListener.prototype.invalid = function (result) {
  };

  return NodeConsoleListener;
});
