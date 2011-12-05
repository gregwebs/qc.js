define('Prop', [
  'core', 'util',
  'Case', 'Distribution', 'Fail', 'Stats'
],function(qs, util, Case, Distribution, Fail, Stats) {
  /**
   * Creates a new Property with given argument generators and a testing
   * function. For each generator in the gens array a value is generated,
   * so for testing a 2-ary function the gens array must contain 2 generators.
   *
   * @param {String} name the property its name
   * @param {Array} gens array of generators to draw arguments from
   * @param {Function} body property test function.
   *
   * @class
   */
  function Prop(name, gens, body) {
      this.name = name;
      this.gens = gens;
      this.body = body;
  }

  /**
   * @private
   */
  Prop.prototype.generateArgs = function (size) {
      var i, gen, args = [];

      for (i = 0; i < this.gens.length; i += 1) {
          gen = this.gens[i];
          args.push(util.generateValue(gen, size));
      }
      return args;
  };

  /**
   * @private
   */
  Prop.prototype.generateShrunkArgs = function (size, args, maxShrunkArgs) {
      // Create shrunk args for each argument.
      var i, gen, countShrunk = 0, shrunk = [], newArgs = [];

      for (i = 0; i < this.gens.length; i++) {
          gen = this.gens[i];
          if ((gen instanceof Function) || gen.shrink === undefined ||
             gen.shrink === null || !(gen.shrink instanceof Function))
          {
              shrunk.push([args[i]]);
          } else {
              tmp = gen.shrink(size, args[i]);
              if (tmp === undefined ||
                  (tmp instanceof Array && tmp.length === 0))
              {
                  shrunk.push([args[i]]);
              } else {
                  countShrunk++;
                  shrunk.push(tmp);
              }
          }
      }

      if (countShrunk === 0) {
          return [];
      }

      // create index list to draw lists of arguments from
      var idxs = [];
      for (i = 0; i < this.gens.length; i++) {
          idxs[i] = 0;
      }

      // create list of shrunk arguments:
      while (idxs[0] < shrunk[0].length) {
          var tmp = [];
          for (i = 0; i < shrunk.length; i++) {
              tmp[i] = shrunk[i][idxs[i]];
          }
// TODO We could filter out double values, to not generate the same test cases over and over, hash and dont add twice, what about none simple values?
          newArgs.push(tmp);

          // adjust all indices
          while (i-- > 0) {
              idxs[i] += 1;
              if (i !== 0 && idxs[i] >= shrunk[i].length) {
                  idxs[i] = 0;
              } else {
                  break;
              }
          }
      };
      return reduceToMaxShrunkArgs(newArgs, maxShrunkArgs);
  };

  /** If a max number of shrunk shrunkArgs is given reduce the shrunkArgs array down to that number.
   *
   * @param shrunkArgs {Array} The shrunk arguments list.
   * @param maxShrunkArgs {Integer} The max number of shrunk args to provide as input to the shrink method.
   */
  function reduceToMaxShrunkArgs(shrunkArgs, maxShrunkArgs){
      if (maxShrunkArgs && shrunkArgs.length>maxShrunkArgs){
        // Since we ceil the result here, we may end up with less than 100, but that's ok,
        // the more shrunkArgs we had before the closer we get to the 100, and the less
        // the smaller the number also gets, which means the relevance is high enough.
        var everyXth = Math.ceil(shrunkArgs.length / maxShrunkArgs);
        var ret = [];
        for (var i=0; i<shrunkArgs.length; i+=everyXth){
          ret.push(shrunkArgs[i]);
        }
        shrunkArgs = ret;
      }

      return shrunkArgs;
  };

  /**
   * tests the property.
   *
   * @param {Config} config configuration to test property with
   * @return depending on test result a Pass, Fail or Invalid object
   */
  Prop.prototype.run = function (config) {
    var args, testCase, dist, shrunkArgs;
    var stats = new Stats(), size = 0, collected = [];

      while (config.needsWork(stats.counts.pass, stats.counts.invalid)) {
          args = this.generateArgs(size);
          testCase = new Case(args);
          try {
            this.body.apply(this, [testCase].concat(args));
            stats.addPass(args);
          }
          catch (e) {
              if (e === 'AssertFailed') {
                  stats.addFail(args);
                  dist = !testCase.collected ||
                          testCase.collected.length === 0 ?  null :
                              new Distribution(testCase.collected);

                  shrunkArgs = this._shrinkLoop(config, size, args, stats);
                  return new Fail(this, stats, args, shrunkArgs,
                                  testCase.tags, dist);
              } else if (e === 'InvalidCase') {
                stats.addInvalid(args);
              } else {
                  throw (e);
              }
          }
          size += 1;
          stats.addTags(testCase.tags);
          collected = collected.concat(testCase.collected);
      }

      stats.collected = !collected || collected.length === 0 ? null :
                          new Distribution(collected);

      return stats.newResult(this);
  };

  /**
   * @private
   */
  Prop.prototype._shrinkLoop = function(config, size, args, stats) {
    var i, testCase;
    var failedArgs = [args], shrunkArgs = [];
    for (var loop = 0; loop < config.maxShrink; loop++) {
      // Create shrunk argument lists from failed arguments.
      shrunkArgs = [];
      for (i = 0; i < failedArgs.length; i++) {
        shrunkArgs = shrunkArgs.concat(
          this.generateShrunkArgs(size, failedArgs[i], config.maxShrunkArgs));
      }
      if (shrunkArgs.length > 0) {
        // Create new failed arguments from shrunk ones by running the property.
        failedArgs = [];
        for (i = 0; i < shrunkArgs.length; i++) {
          var args = shrunkArgs[i];
          try {
            testCase = new Case(args);
            this.body.apply(this, [testCase].concat(args));
            stats.addShrinkPass(args);
          } catch (e) {
            if (e === 'InvalidCase') {
              stats.addShrinkInvalid(args);
            } else if (e === 'AssertFailed') {
              stats.addShrinkFail(args);
              if (loop === config.maxShrink - 1) {
                return args;
              } else {
                failedArgs.push(args);
              }
            } else {
              throw e;
            }
          }
        }
      }
    }
    return failedArgs.length === 0 ? null : failedArgs[0];
  };

  return Prop;
});
