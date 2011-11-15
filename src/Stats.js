/**
 * Statistics class for counting number of pass/invalid runs, building
 * histograms and other statistics for reporting a property its testing
 * results.
 *
 * @class
 */
function Stats() {
    /** 
     * number of successful tests
     * @field 
     * */
    this.pass = 0;

    /** 
     * number of failed tests
     * @field 
     * */
    this.invalid = 0;

    /**
     * list of tags (created by calling Case.classify) with counts
     * @field
     */
    this.tags = [];

    /**
     * Histogram of collected values (create by calling Case.collect)
     * @field
     */
    this.collected = null;
}

/**
 * @private
 */
Stats.prototype.incInvalid = function () { 
    this.invalid += 1; 
};

/**
 * @private
 */
Stats.prototype.incPass = function () { 
    this.pass += 1; 
};

/**
 * @private
 */
Stats.prototype.addTags = function (ts) {
    var i, j, tag, found;

    for (i = 0; i < ts.length; i++) {
        tag = ts[i];
        found = false;
        for (j = 0; j < this.tags.length; j++) {
            if (this.tags[j][1] === tag) {
                found = true;
                this.tags[j][0] += 1;
            }
        }
        if (!found) {
            this.tags.push([1, tag]);
        }
    }
};

/**
 * @private
 */
Stats.prototype.newResult = function (prop) {
    if (this.pass > 0) {
        return new Pass(prop, this);
    } else {
        return new Invalid(prop, this);
    }
};

Stats.prototype.toString = function () {
    return "(pass=" + this.pass + ", invalid=" + this.invalid + ")";
};
