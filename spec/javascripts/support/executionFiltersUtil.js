(function() {
  var env = jasmine.getEnv(),
      utilFns = {},
      specLookupTree;

  function getLookupTree() {
    if (!specLookupTree) {
      specLookupTree = constructSpecLookupTree();
    }

    return specLookupTree;
  }

  utilFns.filterRunnablesFromCurrentRunnables = function(runnableIds, currentRunnableIds) {
    var tree = getLookupTree(),
        runnablesToReturn = [];

    for (var i = 0; i < runnableIds.length; i++) {
      var runnableId = runnableIds[i];
      for (var j = 0; j < currentRunnableIds.length; j++) {
        var currentRunnableId = currentRunnableIds[j];
        if (containsInSubtree(runnableId, currentRunnableId)) {
          runnablesToReturn.push(currentRunnableId);
        } else if (containsInSubtree(currentRunnableId, runnableId)) {
          runnablesToReturn.push(runnableId);
          break;
        }
      }
    }

    return runnablesToReturn;
  };

  utilFns.runnablesFromIds = function(ids) {
    var tree = getLookupTree(),
        runnables = [];

    for (var i = 0; i < ids.length; i++) {
      runnables.push(tree[ids[i]].runnable);
    }

    return runnables;
  };

  utilFns.idsFromRunnables = function(runnables) {
    var ids = [];
    for (var i = 0; i < runnables.length; i++) {
      ids.push(runnables[i].id);
    }

    return ids;
  };

  function constructSpecLookupTree() {
    var runnables = [env.topSuite],
        tickTime = 0,
        tree = {};

    while(runnables.length) {
      var runnable = runnables.shift();
      var lookup = tree[runnable.id];
      if (lookup) {
        lookup.endTick = tickTime;
      } else {
        lookup = {startTick: tickTime, runnable: runnable};
        tree[runnable.id] = lookup;
        runnables.unshift(runnable);
        if (runnable.children) {
          Array.prototype.unshift.apply(runnables, runnable.children());
        }
      }

      tickTime++;
    }

    return tree;
  }

  function containsInSubtree(runnableId, possiblyContainedRunnableId) {
    var tree = getLookupTree(),
        runnableLookup = tree[runnableId],
        possiblyContainedLookup = tree[possiblyContainedRunnableId];

    return (possiblyContainedLookup.startTick >= runnableLookup.startTick) &&
      (possiblyContainedLookup.endTick <= runnableLookup.endTick);
  }

  jasmine.executionFiltersUtil = utilFns; 
})();
