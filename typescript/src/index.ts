const PARTS_KEY = '__parts';

const multiply = <P>(p1: P, p2: P, options: MultiplyOptions): P => {
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

export interface MultiplyOptions {
  resultName?: string;
}

export interface FoldOptions extends MultiplyOptions {
  multiply?<P>(part1: P, part2: P, foldOptions?: MultiplyOptions): P;
}

export const fold = <P>(parts: P[], options?: FoldOptions): P => {
  const defOpts = options || {};
  const opts: MultiplyOptions = { resultName: defOpts.resultName };
  let fractal;
  if (!parts || parts.length === 0) {
    fractal = undefined;
  } else if (parts.length === 1) {
    fractal = multiply(parts[0], undefined, opts);
  } else {
    fractal = parts[0];
    for (let idx = 1; idx < parts.length; idx++) {
      fractal = multiply(fractal, parts[idx], opts);
    }
  }
  if (fractal) {
    const pureParts = [];
    for (const part of parts) {
      if (part) {
        if ((part as any)[PARTS_KEY]) {
          pureParts.push(...(part as any)[PARTS_KEY]);
        } else {
          pureParts.push(part);
        }
      }
    }
    Object.defineProperty(fractal, PARTS_KEY, {
      value: pureParts
    });
  }
  return fractal;
};

export const foldTo = <P, W extends P>(whole: W, parts: P[], options?: FoldOptions): void => {
  const defOpts = options || {};
  const opts: FoldOptions = { multiply: defOpts.multiply || multiply };
  const result = fold(parts, opts);
  if (result) {
    for (const key of Object.keys(result)) {
      whole[key] = result[key];
    }
    Object.defineProperty(whole, PARTS_KEY, { value: (result as any)[PARTS_KEY] });
  }
};

export const getPureParts = <P, W extends P>(whole: W): P[] => {
  return whole ? (whole as any)[PARTS_KEY] : undefined;
};
