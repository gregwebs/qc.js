;(function(){
  // Make it work in node.js and in the browser, with both requires.
  if (typeof exports != 'undefined'){
    var qc = require('../dist/qc.js').qc;
    main(qc);
  } else {
    define(['qc'], main);
  }

  function main(qc){

    // Show a simple example, inspired by http://theyougen.blogspot.com/2010/11/alternative-test-approach-quickcheck.html
    // The article above tested a simple string splitter, which is
    // basically what array.split provides.
    //
    // The Java implementation looks likes this:
    //  @Test public void simpleSplit() {
    //    for (List<String> words : someNonEmptyLists(strings())) {
    //      char separator = anyDistinctCharacter(words);
    //      String input = Joiner.on(separator).join(words);
    //      Iterable<String> letters = Splitter.on(separator).split(input);
    //      assertEquals(words, Lists.newArrayList(letters));
    //    }
    //  }

    var gen = qc.generator;

    // Here we create the function that we pass to our test.
    // This function creates an non-empty array of strings, which will be
    // our words that shall be joined and split.
    var words = gen.nonEmptyArrays(gen.string.strings);

    // Define the test property (that's what its called in the quickcheck world).
    // The following is the function that will be executed a defined number of times (100 in our case),
    // see runner.html (the Config() constructor). For each run words
    // is called and uses the above generators (nonEmptyArrays and strings)
    // to create random values.
    qc.declare("stringSplitter", [words],
      function(testCase, value) {
        var possibleSeparators = getDistinctCharacters(value.join(''));
        testCase.guard(possibleSeparators.length != 0); // If no separator can be found, try again, marks this test case as invalid.
        var separator = possibleSeparators[0];
        var input = value.join(separator);
        // The actual test, that the split function works :).
        var splitResult = input.split(separator);
        // Compare the string representation of the arrays.
        testCase.assert( ''+value == ''+splitResult );
      }
    );



    /**
     * Return an array of characters that are not contained in the
     * given ones.
     */
    var getDistinctCharacters = function(chars){
      var unused = [];
      for (var i=32; unused.push(i) && i<255; i++){}; // Create an array with all ints from 32..255, all possible chars.
      chars.split('').map(function(s){
        var foundAtPos = unused.indexOf(s.charCodeAt(0));
        if (foundAtPos!=-1){
          unused.splice(foundAtPos, 1); // Remove the found value.
        }
      });
      return unused.map(function(charCode){ return String.fromCharCode(charCode) });
    };
  //*/
  };
})();
