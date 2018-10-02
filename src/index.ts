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

export interface UnfoldOptions extends MultiplyOptions {
  multiply?<P>(part1: P, part2: P, unfoldOptions?: MultiplyOptions): P;
}

export const unfold = <P>(parts: P[], options?: UnfoldOptions): P => {
  const defOpts = options || {};
  const opts: MultiplyOptions = { resultName: defOpts.resultName };
  if (!parts || parts.length === 0) {
    return undefined;
  } else if (parts.length === 1) {
    return multiply(parts[0], undefined, opts);
  } else {
    let result = parts[0];
    for (let idx = 1; idx < parts.length; idx++) {
      result = multiply(result, parts[idx], opts);
    }
    return result;
  }
};

export const unfoldTo = <P, W extends P>(whole: W, parts: P[], options?: UnfoldOptions) => {
  const defOpts = options || {};
  const opts: UnfoldOptions = { multiply: defOpts.multiply || multiply };
  const result = unfold(parts, opts);
  if (result) {
    for (const key of Object.keys(result)) {
      whole[key] = result[key];
    }
  }
};
