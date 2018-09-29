## Fractal Objects

[![npm version](https://badge.fury.io/js/fractal-objects.svg)](https://badge.fury.io/js/fractal-objects)
[![Twitter Follow](https://img.shields.io/twitter/follow/sysgears.svg?style=social)](https://twitter.com/sysgears)

## Installation

```bash
npm install --save-dev fractal-objects
```

## Usage
``` js
import { unfold } from 'fractal-objects';

const part1 = { arrayKey: [1], objectKey: { a: 'a', b: 'b' } };
const part2 = { arrayKey: [2, 3], objectKey: { c: 'c' } };
const part3 = { arrayKey: [4] }

console.log(unfold([part1, part2, part3]));
// Output:
// { arrayKey: [ 1, 2, 3, 4 ], objectKey: { a: 'a', b: 'b', c: 'c' } }
```

## License
Copyright © 2018 [SysGears (Cyprus) Limited]. This source code is licensed under the [MIT] license.

[MIT]: LICENSE
[SysGears (Cyprus) Limited]: http://sysgears.com
