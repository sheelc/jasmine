// TODO: This is a nice replacement for toEqual
//
// * Consider moving to jsDiff for differencing objects
// *

describe("Matchers", function() {
  var env, suite, spec;

  // TODO: move this to SpecHelper?

  function match(value) {
    return spec.expect(value);
  }

  // TODO: this test has WAY too much knowledge of how matchers work - proof tha the results object is hard to use and should have a better interface
  function lastResult() {
    return spec.addMatcherResult.mostRecentCall.args[0];
  }

  describe("toEqual2", function() {
    beforeEach(function() {
      env = new jasmine.Env();
      env.updateInterval = 0;

      suite = env.describe("suite", function() {
        spec = env.it("spec", function() {
        });
      });
      spyOn(spec, 'addMatcherResult');

      // TODO: if the results object is easier to use, this could go away?
      this.addMatchers({
        toPass:function() {
          return lastResult().passed();
        },
        toFail:function() {
          return !lastResult().passed();
        }
      });
    });

    it("should compare against null", function() {
      expect(match(null).toEqual2(null)).toPass();
      expect(match(null).not.toEqual2(null)).toFail();

      expect(match(null).toEqual2({})).toFail();
      expect(match(null).not.toEqual2({})).toPass();
    });

    it("should compare against undefined", function() {
      expect(match(undefined).toEqual2(undefined)).toPass();
      expect(match(undefined).not.toEqual2(undefined)).toFail();

      expect(match(undefined).toEqual2({})).toFail();
      expect(match(undefined).not.toEqual2({})).toPass();

      expect(match(undefined).not.toEqual2(null)).toPass();
      expect(match(undefined).toEqual2(null)).toFail();
    });

    it("should compare Booleans", function() {
      expect(match(true).toEqual2(true)).toPass();
      expect(match(true).not.toEqual2(false)).toPass();

      expect(match(false).toEqual2(true)).toFail();
      expect(match(false).not.toEqual2(false)).toFail();
    });

    it("should compare Strings", function() {
      expect((match("cat").toEqual("cat"))).toPass();
      expect((match("cat").not.toEqual("cat"))).toFail();

      expect((match("cat").toEqual("123"))).toFail();
      expect((match("cat").not.toEqual("123"))).toPass();
    });

    it("should compare Dates", function() {
      expect((match(new Date(2008, 1, 3, 15, 17, 19, 1234)).toEqual(new Date(2009, 1, 3, 15, 17, 19, 1234)))).toFail();
      expect((match(new Date(2008, 1, 3, 15, 17, 19, 1234)).not.toEqual(new Date(2009, 1, 3, 15, 17, 19, 1234)))).toPass();

      expect((match(new Date(2008, 1, 3, 15, 17, 19, 1234)).toEqual(new Date(2008, 1, 3, 15, 17, 19, 1234)))).toPass();
      expect((match(new Date(2008, 1, 3, 15, 17, 19, 1234)).not.toEqual(new Date(2008, 1, 3, 15, 17, 19, 1234)))).toFail();
    });

    it("should compare Numbers", function() {
      expect((match(5).toEqual(5))).toPass();
      expect((match(5).not.toEqual(5))).toFail();

      expect((match(5).toEqual(3276.7))).toFail();
      expect((match(5).not.toEqual(3276.7))).toPass();
    });

    it("should compare objects", function() {
      expect(match({a:1}).toEqual({a:1})).toPass();
      expect(match({a:1}).not.toEqual({a:1})).toFail();
      expect(match({a:1}).toEqual({a:2})).toFail();
      expect(match({a:1}).not.toEqual({a:2})).toPass();
    });

    it("should compare objects with cycles", function() {
      var circularGraph = {};
      circularGraph.referenceToSelf = circularGraph;

      expect((match(circularGraph).toEqual2(circularGraph))).toPass();
      expect((match(circularGraph).not.toEqual2(circularGraph))).toFail();
    });

    it("should compare Arrays", function() {
      expect(match([1, 2, 3]).toEqual2([1, 2, 3])).toPass();
      expect(match([1, 2, 3]).not.toEqual2([1, 2, 3])).toFail();

      expect(match([1, 2, 3]).toEqual2([3, 2, 1])).toFail();
      expect(match([1, 2, 3]).not.toEqual2([3, 2, 1])).toPass();

      expect(match([1]).toEqual2([3, 2, 1])).toFail();
      expect(match([1]).not.toEqual2([3, 2, 1])).toPass();
    });

    it("should compare functions", function() {
      var functionA = function() {
        return 0;
      };
      var functionB = function() {
        return 0;
      };

      expect(match(functionA).toEqual2(functionB)).toFail();
      expect(match(functionA).not.toEqual2(functionB)).toPass();

      var functionC = functionB;

      expect(match(functionC).toEqual2(functionB)).toPass();
      expect(match(functionC).not.toEqual2(functionB)).toFail();
    });

    it("should report its message", function() {
      var actual = 'a';
      var matcher = match(actual);
      var expected = 'b';
      matcher.toEqual2(expected);

      var result = lastResult();

      expect(result.matcherName).toEqual("toEqual2");
      expect(result.passed()).toFail();
      expect(result.message).toMatch(jasmine.pp(actual));
      expect(result.message).toMatch(jasmine.pp(expected));
      expect(result.expected).toEqual(expected);
      expect(result.actual).toEqual(actual);
    });

  });
});