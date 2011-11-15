// generic 'console' listener. When overwriting implement log and warn
/**
 * Abstract class for building 'console' based listeners.
 * Subclasses MUST implement the functions:
 * <ul>
 *   <li>passed</li>
 *   <li>invalid</li>
 *   <li>log</li>
 *   <li>failure</li>
 * </ul>
 *
 * @param maxCollected maximum number of collected elements to display in
 *                     console
 *
 * @class
 */
function ConsoleListener(maxCollected) {
    this.maxCollected = maxCollected || -1;
}

/**
 * Callback to be called for every tested property.
 *
 * @param result a property its test result (Pass, Invalid, Failure)
 */
ConsoleListener.prototype.noteResult = function (result) {
    var i, tags, tag, distr, d,
        status_string = result.status + ": " + result.name;

    if (result.status === "pass") {
        this.passed(result);
        //this.log(result.counts);
    } else {
        this.invalid(status_string);
        this.log(result);
    }
    if (result.status === "fail") {
        this.failure("Failed case:");
        this.log(result.failedCase);
    }

    //print tags
    tags = result.stats.tags;
    if (tags && tags.length > 0) {
        this.log('tags:');
        for (i = 0; i < tags.length;i++) {
            tag = tags[i];
            if (tag instanceof Array) {
                this.log(tag[0] + " : " + tag[1]);
            } else {
                this.log(tag);
            }
        }
    }

    //print histogram statistics if present
    if (this.maxCollected !== 0 && 
        result.stats.collected && 
        result.stats.collected.length > 0)
    {
        distr = result.stats.collected;
        distr = distr.data.slice(
            0, this.maxCollected === -1 ? distr.data.length :
               Math.min(distr.data.length, this.maxCollected));

        distr.sort(function (a, b) {
            return -1 * (a[0] - b[0]);
        });

        this.log('collected:');
        for (i = 0; i < distr.length; i++) {
            d = distr[i];
            this.log(d[0] * 100 + "% : " + d[1]);
        }
    }

};

/**
 * Callback to notify listener that testing all properties finished.
 */
ConsoleListener.prototype.done = function (result) {
    this.log('done.');
};

/**
 * MUST BE IMPLEMENTED BY SUBCLASSES.
 * Used by the ConsoleListener to print a message.
 * @param msg the message to print
 */
ConsoleListener.prototype.log = function(msg) {
    throw("to be implemented by subclass");
}

/**
 * MUST BE IMPLEMENTED BY SUBCLASSES.
 * Print a pass message.
 * @param msg the message to print
 */
ConsoleListener.prototype.passed = function(msg) {
    throw("to be implemented by subclass");
}

/**
 * MUST BE IMPLEMENTED BY SUBCLASSES.
 * Print an invalid property message.
 * @param msg the message to print
 */
ConsoleListener.prototype.invalid = function(msg) {
    throw("to be implemented by subclass");
}

/**
 * MUST BE IMPLEMENTED BY SUBCLASSES.
 * Print a failure message.
 * @param msg the message to print
 */
ConsoleListener.prototype.failure = function(msg) {
    throw("to be implemented by subclass");
}
