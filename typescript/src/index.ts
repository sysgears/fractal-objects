/**
 * @file Provides basic functions to fold and unfold fractal objects.
 *
 * A fractal object is an object that has self-similarity at lower scales.
 * Multiplication of two fractal objects results in a new fractal object
 * that has the same shape as the original ones.
 *
 * If we run multiplication on a list of fractal objects, by
 * multiplying items in a list pairwise we will receive
 * fractal object again which will be the representation
 * of all the fractal objects in the list and which will have
 * the same form.
 *
 * By default multiplication function provided by this package
 * multiplies two objects by concatenating array values,
 * merging object values and replacing scalars with value
 * from the second multipled object. But any other multiplication
 * function can be used provided it has the following properties:
 *   1. It keeps the shape of the object. E.g multiplicands and result
 *      have the same shape and the same type.
 *   2. It is commutative - changing the order of multiplication
 *      should not change result.
 *   3. It is associative - e.g. multiplying (a * b) * c should have
 *      the same result as multiplying a * (b * c)
 *   4. Multiplication of `undefined * a` or `a * undefined` yields `a`
 *
 * In terms of mathematics the fractal objects is a commutative
 * semigroup.
 */
const PARTS_KEY = '__parts';

/**
 * Multiplies two objects by concatenating array values,
 * merging object values and replacing scalars with value
 * from the second multipled object.
 *
 * Both two arguments and the result of multiplication must
 * have the same generic type.
 *
 * Example:
 * ```
 * const p1 = { arrayKey: [1], objectKey: { a: 'a', b: 'b' } };
 * const p2 = { arrayKey: [2, 3], objectKey: { c: 'c' } };
 * console.log(defaultMultiply(p1, p2));
 * // Output:
 * { arrayKey: [1, 2, 3], objectKey: { a: 'a', b: 'b', c: 'c' } }
 * ```
 *
 * @param p1 first multiplied object
 * @param p2 second multiplied object
 *
 * @returns multiplication result
 */
export const defaultMultiply = <P>(p1: P, p2: P): P => {
  if (!p1 && !p2) {
    return undefined;
  }
  const part1 = typeof p1 === 'undefined' ? {} : p1;
  const part2 = typeof p2 === 'undefined' ? {} : p2;
  // tslint:disable-next-line
  const result = {} as P;
  const keys1 = Object.keys(part1);
  const keys2 = Object.keys(part2);
  const keys = keys1.slice();
  for (const key of keys2) {
    if (keys1.indexOf(key) < 0) {
      keys.push(key);
    }
  }
  for (const key of keys) {
    const val1 = part1[key];
    const val2 = part2[key];
    try {
      const constructor = typeof val1 === 'undefined' ? undefined : val1.constructor;
      const constructor2 = typeof val2 === 'undefined' ? undefined : val2.constructor;
      if (
        (typeof val1 === 'undefined' && typeof val2 !== 'undefined') ||
        (typeof val1 !== 'undefined' && typeof val2 === 'undefined')
      ) {
        result[key] = typeof val1 === 'undefined' ? val2 : val1;
      } else if (constructor !== constructor2) {
        throw new Error(
          `'${key}' has different types: ${constructor} and ${constructor2}\nPart1: ${JSON.stringify(
            p1
          )}\nPart2: ${JSON.stringify(p2)}`
        );
      } else {
        if (constructor === Array) {
          for (const part of [part1, part2]) {
            if (part[key] && (part[key].indexOf(undefined) >= 0 || part[key].indexOf(null) >= 0)) {
              throw new Error(
                `${part.constructor.name}.${key}=${JSON.stringify(
                  part[key]
                )}. Array with undefined values is forbidden'`
              );
            }
          }
          result[key] = val1.concat(val2);
        } else if (constructor === Object) {
          result[key] = { ...val1, ...val2 };
        } else {
          result[key] = val2;
        }
      }
    } catch (e) {
      e.message = `Error while handling key '${key}'. ` + e.message;
      throw e;
    }
  }
  return result;
};

/**
 * Fold function options
 */
export interface FoldOptions {
  /**
   * A function to be used by `fold` that multiplies two
   * objects of the same generic type `<P>` and returns
   * the result of type `<P>`. The `fold` given the object list
   * as argument runs multiplication function to
   * multiply all the item in the list into single result.
   *
   * For example, given the list `[a, b, c]` the fold function
   * will yield `result = a * b * c`, where `*` is a
   * multiplication function.
   *
   * Multiplication function must fulfil the following requirements:
   *   1. It keeps the shape of the object. E.g multiplicands and result
   *      have the same shape and the same type.
   *   2. It is commutative - changing the order of multiplication
   *      should not change result.
   *   3. It is associative - e.g. multiplying (a * b) * c should have
   *      the same result as multiplying a * (b * c)
   *   4. Multiplication of `undefined * a` or `a * undefined` yields `a`
   *
   * @param p1 first multiplied object
   * @param p2 second multiplied object
   *
   * @returns multiplication result
   */
  multiply?<P>(part1: P, part2: P): P;
}

/**
 * A function that given the object list of the same generic
 * type `<P>` yields the single result of type `<P>` by
 * running multiplication function.
 *
 * For example, given the list `[a, b, c]` the fold function
 * will yield `result = a * b * c`, where `*` is a
 * multiplication function.
 *
 * @param parts an object list to be multiplied together
 * @param options fold options
 */
export const fold = <P>(parts: P[], options?: FoldOptions): P => {
  const opts = {
    multiply: (options || {}).multiply || defaultMultiply
  };
  let fractal;
  if (!parts || parts.length === 0) {
    fractal = undefined;
  } else if (parts.length === 1) {
    fractal = opts.multiply(parts[0], undefined);
  } else {
    fractal = parts[0];
    for (let idx = 1; idx < parts.length; idx++) {
      fractal = opts.multiply(fractal, parts[idx]);
    }
  }
  if (fractal) {
    const fractalParts = [];
    for (const part of parts) {
      if (part) {
        if ((part as any)[PARTS_KEY]) {
          fractalParts.push(...(part as any)[PARTS_KEY]);
        } else {
          fractalParts.push(part);
        }
      }
    }
    Object.defineProperty(fractal, PARTS_KEY, {
      value: fractalParts,
      configurable: true
    });
  }
  return fractal;
};

/**
 * A function that given the object list of the same generic
 * type `<P>` yields the single result of type `<P>` by
 * running multiplication function and stores the result
 * into `whole` parameter
 *
 * For example, given the list `[a, b, c]` the fold function
 * will yield `result = a * b * c`, where `*` is a
 * multiplication function.
 *
 * @param whole the destination object, to store multiplication result to
 * @param parts an object list to be multiplied together
 * @param options fold options
 */
export const foldTo = <P, W extends P>(whole: W, parts: P[], options?: FoldOptions): void => {
  const result = fold(parts, options);
  if (result) {
    for (const key of Object.keys(result)) {
      whole[key] = result[key];
    }
    Object.defineProperty(whole, PARTS_KEY, { value: (result as any)[PARTS_KEY], configurable: true });
  }
};

/**
 * Given multiplication result produced by `fold` or `foldTo`
 * returns the object list that were multiplied together.
 *
 * @param whole a multiplication result produced by `fold` or `foldTo`
 *
 * @returns the object list that were multiplied together
 */
export const getParts = <P, W extends P>(whole: W): P[] => {
  return whole && (whole as any)[PARTS_KEY] ? (whole as any)[PARTS_KEY] : [];
};
