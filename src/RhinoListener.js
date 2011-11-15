/**
 * QuickCheck callback for Rhino sending property results to stdout.
 *
 * @extends ConsoleListener
 * @class
 */
function RhinoListener(maxCollected) {
    this.maxCollected = maxCollected || 10;
}
RhinoListener.prototype = new ConsoleListener();
RhinoListener.prototype.log = function (str) { 
    print(str.toString()); 
};
RhinoListener.prototype.passed = function (str) {
    //print message in green
    print('\033[32m' + str.toString() + '\033[0m');
}
RhinoListener.prototype.invalid = function (str) {
    //print message in yellow
    print('\033[33m' + str.toString() + '\033[0m');
}
RhinoListener.prototype.failure = function (str) {
    //print message in red
    print('\033[31m' + str.toString() + '\033[0m');
}

