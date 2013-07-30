// Jasmine boot.js for browser runners - exposes external/global interface, builds the Jasmine environment and executes it.
(function() {

  window.jasmine = jasmineRequire.core(jasmineRequire);
  jasmineRequire.html(jasmine);

  var env = jasmine.getEnv(),
      suitesToRun = [],
      specsToRun = [];

  var jasmineInterface = {
    describe: function(description, specDefinitions) {
      return env.describe(description, specDefinitions);
    },

    xdescribe: function(description, specDefinitions) {
      return env.xdescribe(description, specDefinitions);
    },

    fdescribe: function(description, specDefinitions) {
      var suite = env.describe(description, specDefinitions);
      suitesToRun.push(suite);
      return suite;
    },

    it: function(desc, func) {
      return env.it(desc, func);
    },

    xit: function(desc, func) {
      return env.xit(desc, func);
    },

    fit: function(desc, func) {
      var spec = env.it(desc, func);
      specsToRun.push(spec);
      return spec;
    },

    beforeEach: function(beforeEachFunction) {
      return env.beforeEach(beforeEachFunction);
    },

    afterEach: function(afterEachFunction) {
      return env.afterEach(afterEachFunction);
    },

    expect: function(actual) {
      return env.expect(actual);
    },

    pending: function() {
      return env.pending();
    },

    addMatchers: function(matchers) {
      return env.addMatchers(matchers);
    },

    spyOn: function(obj, methodName) {
      return env.spyOn(obj, methodName);
    },

    clock: env.clock,
    setTimeout: env.clock.setTimeout,
    clearTimeout: env.clock.clearTimeout,
    setInterval: env.clock.setInterval,
    clearInterval: env.clock.clearInterval,

    jsApiReporter: new jasmine.JsApiReporter({
      timer: new jasmine.Timer()
    })
  };

  if (typeof window == "undefined" && typeof exports == "object") {
    extend(exports, jasmineInterface);
  } else {
    extend(window, jasmineInterface);
  }

  var queryString = new jasmine.QueryString({
    getWindowLocation: function() { return window.location; }
  });

  // TODO: move all of catching to raise so we don't break our brains
  var catchingExceptions = queryString.getParam("catch");
  env.catchExceptions(typeof catchingExceptions === "undefined" ? true : catchingExceptions);

  var htmlReporter = new jasmine.HtmlReporter({
    env: env,
    queryString: queryString,
    onRaiseExceptionsClick: function() { queryString.setParam("catch", !env.catchingExceptions()); },
    getContainer: function() { return document.body; },
    createElement: function() { return document.createElement.apply(document, arguments); },
    createTextNode: function() { return document.createTextNode.apply(document, arguments); },
    timer: new jasmine.Timer()
  });

  env.addReporter(jasmineInterface.jsApiReporter);
  env.addReporter(htmlReporter);

  var specFilter = new jasmine.HtmlSpecFilter({
    filterString: function() { return queryString.getParam("spec"); }
  });

  env.specFilter = function(spec) {
    return specFilter.matches(spec.getFullName());
  };

  var currentWindowOnload = window.onload;

  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }
    htmlReporter.initialize();

    // By the time onload is called, jasmineRequire will be redefined to point
    //   to the Jasmine source files (and not jasmine.js). So re-require
    window.j$ = jasmineRequire.core(jasmineRequire);
    jasmineRequire.html(j$);
    jasmineRequire.console(jasmineRequire, j$);

    var runnablesToRun = toRun(suitesToRun, specsToRun);
    runnablesToRun.length ? env.execute(runnablesToRun) : env.execute();
  };

  function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  }

  function toRun(suitesToRun, specsToRun) {
    var specsAlreadyIncluded = specsFromSuites(suitesToRun);
    var runnablesToRun = suitesToRun.concat(setDifference(specsToRun, specsAlreadyIncluded));

    var runnableIds = [];
    for(var i = 0; i < runnablesToRun.length; i++) {
      runnableIds.push(runnablesToRun[i].id);
    }

    return runnableIds;
  }

  function specsFromSuites(suitesToRun) {
    var specs = [];
    var runnables = suitesToRun.slice(0);
    while(runnables.length) {
      var runnable = runnables.pop();
      if (runnable.children_) {
        runnables = runnables.concat(runnable.children_);
      } else {
        specs.push(runnable);
      }
    }

    return specs;
  }

  function setDifference(a, b) {
    var newSet = [];
    for(var i = 0; i < a.length; i++) {
      if(b.indexOf(a[i]) === -1) {
        newSet.push(a[i]);
      }
    }

    return newSet;
  }

}());
