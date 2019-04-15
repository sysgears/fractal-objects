## Fractal Objects

[![npm version](https://badge.fury.io/js/fractal-objects.svg)](https://badge.fury.io/js/fractal-objects)
[![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Installation

```bash
npm install --save-dev fractal-objects
```

## Usage
``` js
import { fold } from 'fractal-objects';

const part1 = { arrayKey: [1], objectKey: { a: 'a', b: 'b' } };
const part2 = { arrayKey: [2, 3], objectKey: { c: 'c' } };
const part3 = { arrayKey: [4] }

console.log(fold([part1, part2, part3]));
// Output:
// { arrayKey: [ 1, 2, 3, 4 ], objectKey: { a: 'a', b: 'b', c: 'c' } }
```

## Concept
A fractal object is an object that has self-similarity when
being multiplied by another fractal object. The result of such
multiplication is a fractal object having the same shape.

If we run multiplication on a list of fractal objects, by
multiplying items in a list pairwise we will receive
fractal object again which will be the representation
of all the fractal objects in the list and which will have
the same form.

By default multiplication function provided by this package
multiplies two objects by concatenating array values,
merging object values and replacing scalars with value
from the second multipled object. But any other multiplication
function can be used provided it has the following properties:
  1. It keeps the shape of the object. E.g multiplicands and     result have the same shape and the same type.
  2. It is commutative - changing the order of multiplication
    should not change result.
  3. It is associative - e.g. multiplying (a b) c should have
    the same result as multiplying a (b c)
  4. Multiplication of `undefined a` or `a undefined` yields     `a`

In terms of mathematics the fractal objects is a commutative
semigroup.

## License
Copyright © 2018 [SysGears (Cyprus) Limited]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears (Cyprus) Limited]: http://sysgears.com
