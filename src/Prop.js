define([
  'core',
  'Case', 'Distribution', 'Fail', 'Stats'
],function(qs, Case, Distribution, Fail, Stats) {
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
          args.push(qs.genvalue(gen, size));
      }
      return args;
  };

  /**
   * @private
   */
  Prop.prototype.generateShrinkedArgs = function (size, args) {
      // create shrinked args for each argument
      var i, idxs, tmp, gen, countShrinked = 0, shrinked = [], newArgs = [];

      for (i = 0; i < this.gens.length; i++) {
          gen = this.gens[i];
          if ((gen instanceof Function) || gen.shrink === undefined ||
             gen.shrink === null || !(gen.shrink instanceof Function))
          {
              shrinked.push([args[i]]);
          } else {
              tmp = gen.shrink(size, args[i]);
              if (tmp === undefined ||
                  (tmp instanceof Array && tmp.length === 0))
              {
                  shrinked.push([args[i]]);
              } else {
                  countShrinked++;
                  shrinked.push(tmp);
              }
          }
      }

      if (countShrinked === 0) {
          return [];
      }

      // create index list to draw lists of arguments from
      idxs = new Array(this.gens.length);
      for (i = 0; i < this.gens.length; i++) {
          idxs[i] = 0;
      }

      // create list of shrinked arguments:
      while (idxs[0] < shrinked[0].length) {
          tmp = new Array(shrinked.length);
          for (i = 0; i < shrinked.length; i++) {
              tmp[i] = shrinked[i][idxs[i]];
          }
          newArgs.push(tmp);

          // adjust all indices
          while (i-- > 0) {
              idxs[i] += 1;
              if (i !== 0 && idxs[i] >= shrinked[i].length) {
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
      var args, testCase, dist, shrinkedArgs,
          stats = new Stats(), size = 0, collected = [];

      while (config.needsWork(stats)) {
          args = this.generateArgs(size);
          testCase = new Case(args);
          try {
              this.body.apply(this, [testCase].concat(args));
              stats.incPass();
          }
          catch (e) {
              if (e === "AssertFailed") {
                  dist = !testCase.collected ||
                          testCase.collected.length === 0 ?  null :
                              new Distribution(testCase.collected);

                  shrinkedArgs = qs.shrinkLoop(config, this, size, args);
                  return new Fail(this, stats, args, shrinkedArgs,
                                  testCase.tags, dist);
              } else if (e === "InvalidCase") {
                  stats.incInvalid();
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
