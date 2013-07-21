getJasmineRequireObj().QueueRunner = function() {

  function QueueRunner(attrs) {
    this.fns = attrs.fns || [];
    this.onComplete = attrs.onComplete || function() {};
    this.clearStack = attrs.clearStack || function(fn) {fn();};
    this.onException = attrs.onException || function() {};
    this.catchException = attrs.catchException || function() { return true; };
  }

  QueueRunner.prototype.execute = function() {
    this.run(0);
  };

  QueueRunner.prototype.run = function(recursiveIndex) {
    var length = this.fns.length,
        self = this,
        iterativeIndex;

    for(iterativeIndex = recursiveIndex; iterativeIndex < length; iterativeIndex++) {
      var fn = this.fns[iterativeIndex];
      if (fn.length > 0) {
        fn.call(self, function() { self.clearStack(function() { self.run(iterativeIndex + 1); }); });
        return;
      } else {
        fn.call(self);
      }
    }
  };

  return QueueRunner;
};
