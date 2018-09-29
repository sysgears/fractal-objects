const multiplyObjects = <P>(part1: P, part2: P): P => {
  if (!part1 && !part2) {
    return undefined;
  }
  // tslint:disable-next-line
  const result = {} as P;
  const keys1 = part1 ? Object.keys(part1) : [];
  const keys2 = part2 ? Object.keys(part2) : [];
  const keys = keys1.slice();
  for (const key of keys2) {
    if (keys1.indexOf(key) < 0) {
      keys.push(key);
    }
  }
  for (const key of keys) {
    try {
      const constructor = !part1 || typeof part1[key] === 'undefined' ? undefined : part1[key].constructor;
      const constructor2 = !part2 || typeof part2[key] === 'undefined' ? undefined : part2[key].constructor;
      if (constructor === Array) {
        for (const part of [part1, part2]) {
          if (part && part[key] && (part[key].indexOf(undefined) >= 0 || part[key].indexOf(null) >= 0)) {
            throw new Error(
              `${part.constructor.name}.${key}=${JSON.stringify(part[key])}. Array with undefined values is forbidden'`
            );
          }
        }
      }
      if (typeof constructor === 'undefined' || typeof constructor2 === 'undefined') {
        result[key] = typeof constructor === 'undefined' ? part2[key] : part1[key];
      } else if (constructor !== constructor2) {
        throw new Error(
          `'${key}' has different types: ${constructor} and ${constructor2}\nPart1: ${JSON.stringify(
            part1
          )}\n\nPart2: ${JSON.stringify(part2)}`
        );
      } else {
        result[key] = multiply(part1[key], part2[key]);
      }
    } catch (e) {
      throw new Error(`Error while handling key '${key}'`);
    }
  }
  return result;
};

const multiply = (val1: any, val2: any): any => {
  let result;
  const constructor = val1.constructor;
  if (constructor === Array) {
    result = val1.concat(val2);
  } else if (constructor === Object) {
    result = { ...val1, ...val2 };
  } else {
    result = val2;
  }
  return result;
};

export const unfold = <P>(parts: P[]): P => {
  if (!parts || parts.length === 0) {
    return undefined;
  } else if (parts.length === 1) {
    return multiplyObjects(parts[0], undefined);
  } else {
    let result = parts[0];
    for (let idx = 1; idx < parts.length; idx++) {
      result = multiplyObjects(result, parts[idx]);
    }
    return result;
  }
};

export const unfoldTo = <P, W extends P>(whole: W, parts: P[]) => {
  const result = unfold([whole as P].concat(parts || []));
  for (const key of Object.keys(result)) {
    whole[key] = result[key];
  }
};
