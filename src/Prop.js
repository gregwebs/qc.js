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
  Prop.prototype.generateShrunkArgs = function (size, args) {
      // Create shrunk args for each argument.
      var i, idxs, tmp, gen, countShrunk = 0, shrunk = [], newArgs = [];

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
      idxs = new Array(this.gens.length);
      for (i = 0; i < this.gens.length; i++) {
          idxs[i] = 0;
      }

      // create list of shrunk arguments:
      while (idxs[0] < shrunk[0].length) {
          tmp = new Array(shrunk.length);
          for (i = 0; i < shrunk.length; i++) {
              tmp[i] = shrunk[i][idxs[i]];
          }
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
      }

      return newArgs;
  };

  /**
   * tests the property.
   *
   * @param {Config} config configuration to test property with
   * @return depending on test result a Pass, Fail or Invalid object
   */
  Prop.prototype.run = function (config) {
      var args, testCase, dist, shrunkArgs,
          stats = new Stats(), size = 0, collected = [];

      while (config.needsWork(stats)) {
          args = this.generateArgs(size);
          testCase = new Case(args);
          try {
              this.body.apply(this, [testCase].concat(args));
              stats.incrementPass();
          }
          catch (e) {
              if (e === 'AssertFailed') {
                  dist = !testCase.collected ||
                          testCase.collected.length === 0 ?  null :
                              new Distribution(testCase.collected);

                  shrunkArgs = qs.shrinkLoop(config, this, size, args);
                  return new Fail(this, stats, args, shrunkArgs,
                                  testCase.tags, dist);
              } else if (e === 'InvalidCase') {
                  stats.incrementInvalid();
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

  return Prop;
});
