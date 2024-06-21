const NilSym = Symbol("NIL");
export const asyncFilter = async <T>(
  array: T[],
  ...[filter]: Parameters<Array<T>["filter"]>
) => {
  return (
    await Promise.all(
      array.map(
        (item, i, a) =>
          new Promise((res) =>
            requestIdleCallback(() => res(filter(item, i, a) ? item : NilSym)),
          ),
      ),
    )
  ).filter((item) => item !== NilSym);
};

export const asyncEach = async <T>(
  array: T[],
  ...[forEach]: Parameters<Array<T>["forEach"]>
) => {
  await Promise.allSettled(
    array.map(
      (item, i, a) =>
        new Promise((res) =>
          requestIdleCallback(() => res(forEach(item, i, a))),
        ),
    ),
  );
};

export const reduceKeys = <T, U extends keyof T>(array: T[], key: U) =>
  array.reduce(
    (keyObj, item) => ({
      ...keyObj,
      [item[key as keyof typeof item] as string | number | symbol]: item,
    }),
    {} as { [K in T[U] as string | number | symbol]: T },
  ) as { [K in T[U] as string | number | symbol]: T };

export const groupBy = <T extends object>(
  array: T[],
  callbackFn: (item: T, index: number) => string | number,
): Record<string, T[]> => {
  return array.reduce(
    (record: Record<string, T[]>, object: T, index: number) => {
      const key = callbackFn(object, index);
      if (!(key in record)) {
        record[key] = [object];
      } else {
        record[key].push(object);
      }
      return record;
    },
    {} as Record<string, T[]>,
  );
};
