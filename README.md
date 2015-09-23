# Memoize
A small library to memoize functions for Node.js and web browser.   
It supports limiting cache size and governing cache by the performance or frequency of function calls.  

## Usage

```javascript
var memoized = memoize.frequency(func,limit);

```

## Example

```javascript
var memoize = require('./memoize.js');  

var fibonacci = function(n) {
  if (n === 0 || n === 1) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}

var fib = memoize.performance(function(n) {
  return fibonacci(n);
}, 10);

fib(20);

```


