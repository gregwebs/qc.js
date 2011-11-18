define([
  'qc'
],function(qc){

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

  var words = gen.nonEmptyArrays(gen.string.strings);

  qc.declare("stringSplitter", [words],
    function(testCase, value) {
      var possibleSeparators = getDistinctCharacters(value.join(''));
      testCase.guard(possibleSeparators.length != 0); // If no separator can be found, try again, marks this test case as invalid.
      var separator = possibleSeparators[0];
      var input = value.join(separator);
      var splitResult = input.split(separator);
      // Compare the string representation of the arrays.
      testCase.assert( ''+value == ''+splitResult );
    }
  );



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
  }
//*/
});
