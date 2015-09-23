(function() {

  // Standard module setup
  // ---------------------

  // Establish the root object, 'window' ('self') in the browser, 'global'
  // on the server, or 'this' in some virtual machines. We use 'self'
  // instead of 'window' for 'WebWorker' support.
  var root = typeof self === 'object' && self.self === self && self ||
    typeof global === 'object' && global.global === global && global ||
    this;

  // set execution environment 
  var env = typeof global === 'object' ? 'global' : 'window';

  // Save previous value of memoize
  if (root !== null) {
    var previous_memoize = root.memoize;
  }

  // Safe reference to the memoize object
  // Needed if we want to chain in OO eventually .. ?
  var memoize = function(obj) {
    if (obj instanceof memoize) return obj;
    if (!(this instanceof memoize)) return new memoize(obj);
  };

  // Measure function performance
  var functionPerformance = function(t) {
    if (env !== 'global') {
      return !t ? performance.now() : performance.now() - t;
    } else {
      return !t ? process.hrtime() : process.hrtime(t);
    }
  }

  // Module functions
  // ----------------
  // Note: Functions do not follow DRY standards yet.
  // Need to refactor

  // Removes result of least frequently applied arguments from storage after cache limit reached
  memoize.frequency = function(func, limit) {

    var storage = Object.create(null),
      frequency = Object.create(null),
      limit = limit || Infinity,
      resetLimit = limit,
      least = undefined;

    var memorized = function() {
      var args = Array.prototype.slice.apply(arguments);
      if (args in storage) {
        frequency[args] = frequency[args] + 1
        return storage[args];
      }

      if (!(args in storage) && limit < 1) {
        least = Object.keys(frequency).reduce(function(least, key) {
          return (least === undefined || frequency[key] < frequency[least]) ? key : least;
        })
        delete frequency[least] && delete storage[least];
      } else limit--;

      frequency[args] = frequency[args] + 1 || 1;
      return (storage[args] = func.apply(this, args));
    }
    memorized._clear = function() {
      storage = Object.create(null);
      frequency = Object.create(null);
      limit = resetLimit;
      least = undefined;
      return true
    }

    return memorized
  }

  // Removes result of best performing arguments from storage after cache limit is reached
  memoize.performance = function(func, limit) {

    var storage = Object.create(null),
      performance = Object.create(null),
      limit = limit || Infinity,
      resetLimit = limit,
      least = undefined;

    var memorized = function() {
      var args = Array.prototype.slice.apply(arguments);
      if (args in storage) {
        return storage[args];
      }

      if (limit < 1) {
        var fastest = Object.keys(performance).reduce(function(fastest, key) {
          return (fastest === undefined || performance[key] < performance[fastest]) ? key : fastest;
        });
        delete performance[fastest] && delete storage[fastest];
      } else limit--;

      var t = functionPerformance();
      storage[args] = func.apply(this, args);
      performance[args] = functionPerformance(t);
      return storage[args];
    }
    memorized._clear = function() {
      storage = Object.create(null);
      performance = Object.create(null);
      limit = resetLimit;
      least = undefined;
      return true
    }

    return memorized;
  }


  // Export
  // -------

  // For Node.js
  if (typeof module === 'object' && module.exports) {
    module.exports = memoize;
  }
  // AMD / RequireJS (needs to be at end of file)
  else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return memoize;
    });
  }
  // For browser
  else {
    root.memoize = memoize;
  }

}());