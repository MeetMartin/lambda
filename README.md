# @7urtle/lambda

Functional programming library in JavaScript.

![npm](https://img.shields.io/npm/v/@7urtle/lambda.svg)
![NpmLicense](https://img.shields.io/npm/l/@7urtle/lambda.svg)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@7urtle/lambda.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@7urtle/lambda.svg)

![@7urtle/lambda logo](https://user-images.githubusercontent.com/11709245/95030721-1cdb4200-070e-11eb-8c97-5d89019cb654.png)

## Official Website
[www.7urtle.com](https://www.7urtle.com/)

* [Get Started](https://www.7urtle.com/get-started-with-7urtle-lambda)
* [Learn Functional Programming](https://www.7urtle.com/learn-functional-programming-in-javascript)
    * [Functional programming advantages](https://www.7urtle.com/javascript-functional-programming-advantages)
    * [Functional programming basics](https://www.7urtle.com/javascript-functional-programming-basics)
    * [Managing side effects with monads](https://www.7urtle.com/javascript-applicative-functor-monads)
    * [Effortless testing](https://www.7urtle.com/testing-in-javascript-with-functional-programming)
* [API Documentation](https://www.7urtle.com/documentation-7urtle-lambda)
* [About](https://www.7urtle.com/about-7urtle-lambda)

## Why @7urtle/lambda

Lambda was created to allows us to embrace functional programming in JavaScript. It focuses on providing highly
performant code which is itself built using functional paradigms. Provided functions are simple, curried, pure
and optimised for partial application and function composition.

### Focus on your own skill level
@7urtle/lambda was written to help you transition towards functional programming
no matter your skill level. You can pick up any functional features as you learn at your own pace.
At the end you can master everything including pure functions, composition, currying, functors, and monads.

[Learn JavaScript Functional Programming](https://www.7urtle.com/learn-functional-programming-in-javascript)

## Get Started

To use with Node.js:

```
$ npm install --save @7urtle/lambda
```

Require @7urtle/lambda in Node.js:

```
const L = require('@7urtle/lambda');

L.log('Hello world!');
```

 Import @7urtle/lambda in Node.js:
 
 ```
import * as L from '@7urtle/lambda';

L.log('Hello world!');
 ```

Or import just specific functions:

 ```
import {log, upperCaseOf, compose} from '@7urtle/lambda';

const hello = compose(log, upperCaseOf);
hello('Hello World');
// => HELLO WORLD
 ```

Get the minified version from GitHub: [lambda.min.js](https://github.com/MeetMartin/lambda/blob/master/dist/lambda.min.js)

```
<script src="./your/copy/of/lambda.min.js"></script>

<script>
// script on your website
// access @7urtle/lambda using the variable L
const message = L.upperCaseOf('hello world');
alert(message); // HELLO WORLD
</script>
```

Or use public CDN: https://www.jsdelivr.com/package/npm/@7urtle/lambda.

```
<script src="https://cdn.jsdelivr.net/npm/@7urtle/lambda@latest/dist/lambda.min.js"></script>

<script>
// script on your website
// access @7urtle/lambda using the variable L
const message = L.upperCaseOf('hello world');
alert(message); // HELLO WORLD
</script>
```

Try @7urtle/lambda with online playground using [CodePen](https://codepen.io/martin-nov-k/pen/mdPZXKG).