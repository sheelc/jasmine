describe("Matchers", function() {
  var env, suite, spec;

  function lastResult() {
    return (spec.addMatcherResult.mostRecentCall.args[0]).passed();
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
    });

    it("should compare against null", function() {
      spec.expect(null).toEqual2(null);
      expect(lastResult()).toEqual2(true);

      spec.expect(null).not.toEqual2(null);
      expect(lastResult()).toEqual2(false);

      spec.expect(null).toEqual2({});
      expect(lastResult()).toEqual2(false);
 
      spec.expect(null).not.toEqual2({});
      expect(lastResult()).toEqual2(true);
    });

    it("should compare against undefined", function() {
      spec.expect(undefined).toEqual2(undefined);
      expect(lastResult()).toEqual2(true);

      spec.expect(undefined).not.toEqual2(undefined);
      expect(lastResult()).toEqual2(false);

      spec.expect(undefined).toEqual2({});
      expect(lastResult()).toEqual2(false);

      spec.expect(undefined).not.toEqual2({});
      expect(lastResult()).toEqual2(true);

      spec.expect(undefined).not.toEqual2(null);
      expect(lastResult()).toEqual2(true);

      spec.expect(undefined).toEqual2(null);
      expect(lastResult()).toEqual2(false);
    });

    it("should compare Booleans", function() {
      spec.expect(true).toEqual2(true);
      expect(lastResult()).toEqual2(true);

      spec.expect(true).not.toEqual2(false);
      expect(lastResult()).toEqual2(true);

      spec.expect(false).toEqual2(true);
      expect(lastResult()).toEqual2(false);

      spec.expect(false).not.toEqual2(false);
      expect(lastResult()).toEqual2(false);
    });

    it("should compare Strings", function() {
      spec.expect("cat").toEqual2("cat");
      expect(lastResult()).toEqual2(true);

      spec.expect("cat").not.toEqual2("cat");
      expect(lastResult()).toEqual2(false);

      spec.expect("cat").toEqual2("123");
      expect(lastResult()).toEqual2(false);

      spec.expect("cat").not.toEqual2("123");
      expect(lastResult()).toEqual2(true);
    });

    it("should compare Dates", function() {
      var date = new Date(2008, 1, 3, 15, 17, 19, 1234);
      var anotherDate = new Date(2009, 1, 3, 15, 17, 19, 1234);

      spec.expect(date).toEqual2(date);
      expect(lastResult()).toEqual2(true);

      spec.expect(date).not.toEqual2(date);
      expect(lastResult()).toEqual2(false);

      spec.expect(date).toEqual2(anotherDate);
      expect(lastResult()).toEqual2(false);

      spec.expect(date).not.toEqual2(anotherDate);
      expect(lastResult()).toEqual2(true);
    });

    it("should compare Numbers", function() {
      spec.expect(5).toEqual2(5);
      expect(lastResult()).toEqual2(true);

      spec.expect(5).not.toEqual2(5);
      expect(lastResult()).toEqual2(false);

      spec.expect(5).toEqual2(3276.7);
      expect(lastResult()).toEqual2(false);

      spec.expect(5).not.toEqual2(3276.7);
      expect(lastResult()).toEqual2(true);
    });

    it("should compare objects", function() {
      spec.expect({a:1}).toEqual2({a:1});
      expect(lastResult()).toEqual2(true);

      spec.expect({a:1}).not.toEqual2({a:1});
      expect(lastResult()).toEqual2(false);

      spec.expect({a:1}).toEqual2({a:2});
      expect(lastResult()).toEqual2(false);

      spec.expect({a:1}).not.toEqual2({a:2});
      expect(lastResult()).toEqual2(true);
    });

    it("should compare objects with cycles", function() {
      var circularGraph = {};
      circularGraph.referenceToSelf = circularGraph;

      spec.expect(circularGraph).toEqual2(circularGraph);
      expect(lastResult()).toEqual2(true);

      spec.expect(circularGraph).not.toEqual2(circularGraph);
      expect(lastResult()).toEqual2(false);
    });

    it("should compare Arrays", function() {
      spec.expect([1, 2, 3]).toEqual2([1, 2, 3]);
      expect(lastResult()).toEqual2(true);

      spec.expect([1, 2, 3]).not.toEqual2([1, 2, 3]);
      expect(lastResult()).toEqual2(false);

      spec.expect([1, 2, 3]).toEqual2([3, 2, 1]);
      expect(lastResult()).toEqual2(false);

      spec.expect([1, 2, 3]).not.toEqual2([3, 2, 1]);
      expect(lastResult()).toEqual2(true);

      spec.expect([1]).toEqual2([3, 2, 1]);
      expect(lastResult()).toEqual2(false);

      spec.expect([1]).not.toEqual2([3, 2, 1]);
      expect(lastResult()).toEqual2(true);
    });

    it("should compare functions", function() {
      var functionA = function() {
        return 0;
      };
      var functionB = function() {
        return 0;
      };

      spec.expect(functionA).toEqual2(functionB);
      expect(lastResult()).toEqual2(false);

      spec.expect(functionA).not.toEqual2(functionB);
      expect(lastResult()).toEqual2(true);

      var functionC = functionB;

      spec.expect(functionC).toEqual2(functionB);
      expect(lastResult()).toEqual2(true);

      spec.expect(functionC).not.toEqual2(functionB);
      expect(lastResult()).toEqual2(false);
    });

    describe("message on failure", function() {

      it("should explain the object's differences", function() {
        var actual = {
          foo: 'a',
          bar: 'b',
          baz: 'c'
        };
        var expected = {
          bar: 'b',
          quux: 'd'
        };

        spec.expect(actual).toEqual2(expected);
        var result = spec.addMatcherResult.mostRecentCall.args[0];

        expect(result.message).toEqual2("Expected { foo : 'a', bar : 'b', baz : 'c' } to equal2 { bar : 'b', quux : 'd' }.");
      });
    });
  });
});