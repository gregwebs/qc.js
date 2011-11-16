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

  var words = qc.arbArray(qc.arbString);

  qc.declare("stringSplitter", [words],
    function(testCase, value) {
      console.log(value);
    }
  );
//*/
});
