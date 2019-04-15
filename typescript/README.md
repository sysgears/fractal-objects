# Fractal Objects

[![npm version](https://badge.fury.io/js/fractal-objects.svg)](https://badge.fury.io/js/fractal-objects)
[![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Installation

Install Fractal Objects to the development dependencies of your project:

```bash
# With NPM
npm install --save-dev fractal-objects

# With Yarn
yarn add fractal-objects --dev
```

## Usage

```js
import { fold } from 'fractal-objects';

// Fractal object #1
const part1 = { arrayKey: [1], objectKey: { a: 'a', b: 'b' } };
// Fractal object #2
const part2 = { arrayKey: [2, 3], objectKey: { c: 'c' } };
// Fractal object #3
const part3 = { arrayKey: [4] }

// View multiplication of the fractal objects #1, #2, and #3
console.log(fold([part1, part2, part3]));
// Output:
// { arrayKey: [ 1, 2, 3, 4 ], objectKey: { a: 'a', b: 'b', c: 'c' } }
```

## Concept

A fractal object is an object that has self-similarity at lower scales. Multiplication of two fractal objects results in a new fractal object that has the same shape as the original ones.

If we multiply fractal objects in a list pairwise, we'll receive a new fractal object, which will represent all the fractal objects in the list and which will also have the same shape.

By default, the multiplication function provided by the `fractal-objects` package multiplies two objects by concatenating their array values, merging object values, and replacing scalars with
values from the second multiplied object.

Any other multiplication function can be used if it has the following properties:

1. It _keeps the object shape_: The multiplicands and the result must have the same shape and type.
2. It's _commutative_. If you change the order of multiplication, the result must not change.
3. It's _associative_. For example, multiplying `(a b) c` must have the same result as multiplying `a (b c)`.
4. It must yield the result `a` when multiplying `undefined a` or `a undefined`.

In terms of mathematics, fractal objects are a _[commutative semigroup]_.

## License

Copyright © 2018 [SysGears (Cyprus) Limited]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears (Cyprus) Limited]: http://sysgears.com
[commutative semigroup]: https://en.wikipedia.org/wiki/Semigroup
