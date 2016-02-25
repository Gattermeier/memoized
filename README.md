# Memoize
[![npm version](https://badge.fury.io/js/memoized.svg)](https://badge.fury.io/js/memoized)    

A small library to memoize functions for Node.js and web browser.   
It supports limiting cache size and governing cache by the performance or frequency of function calls.  

## Usage

```javascript
const memoized = memoize.frequency(func,limit);

```

## Example

```javascript
const memoize = require('./memoize.js');  

const fibonacci = (n) => {
  if (n === 0 || n === 1) {
    return n;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}

const fib = memoize.performance(fibonacci, 10);
fib(20);

```


