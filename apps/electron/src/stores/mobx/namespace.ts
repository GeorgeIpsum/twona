import { rootRef } from "mobx-keystone";

export const namespace = "2NA" as const;
export type Namespace = typeof namespace;
export type NSStoreName<N extends string> = `${Namespace}/${N}Store`;
export type NSModelName<N extends string> = `${NSStoreName<N>}/${N}`;
export type ResolveNSType<
  N extends string,
  S extends boolean | undefined,
> = S extends true
  ? NSStoreName<N>
  : S extends undefined
    ? NSModelName<N>
    : S extends false
      ? NSModelName<N>
      : never;
type NSKey<Keys extends string[]> = {
  [K in Keys[number]]: NSModelName<K>;
};
export const ns = <N extends string, S extends boolean | undefined>(
  name: N,
  store?: S,
): ResolveNSType<N, S> =>
  `${namespace}/${name}Store${store ? "" : `/${name}`}` as ResolveNSType<N, S>;

export type StoreName<NS extends string> =
  NS extends NSStoreName<infer N> ? N : never;
export const storeName = <NS extends string>(name: NS): StoreName<NS> => {
  const parts = name.split("/") as [Namespace, StoreName<NS>, ModelName<NS>?];
  return parts[1];
};

export type ModelName<NS extends string> =
  NS extends NSModelName<infer N> ? N : never;
export const modelName = <NS extends string>(name: NS): ModelName<NS> => {
  const parts = name.split("/") as [Namespace, StoreName<NS>, ModelName<NS>];
  return parts[2];
};

export const getModelStoreName = <
  NS extends string,
  MNS extends NSModelName<NS>,
>(
  modelName: MNS,
) => {
  const [ns, store] = modelName.split("/") as [
    Namespace,
    StoreName<NS>,
    ModelName<NS>,
  ];

  return [ns, store].join("/") as NSStoreName<StoreName<NS>>;
};

export const getStoreBaseModelName = <
  NS extends string,
  SNS extends NSStoreName<NS>,
>(
  storeName: SNS,
) => {
  const [ns, store] = storeName.split("/") as [Namespace, StoreName<NS>];
  return [ns, store, store.split("Store")[0]].join("/") as NSModelName<NS>;
};

export const named = <N extends string, NN extends string[]>(
  name: N,
  ...names: NN
) => ({
  name,
  model: ns(name, false),
  store: ns(name, true),
  allModels: {
    [name]: ns(name, false),
    ...names.reduce(
      (names, name) => ({ ...names, [name]: ns(name, false) }),
      {} as NSKey<NN>,
    ),
  } as NSKey<[N, ...NN]>,
});

export const buildRef = <T extends object>(modelName: string) =>
  rootRef<T>(`${modelName}Ref`, {});
