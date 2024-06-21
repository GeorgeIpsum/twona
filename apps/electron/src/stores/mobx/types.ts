import type { AnyModel, BaseModelKeys, RefConstructor } from "mobx-keystone";

type IsCoercedDate<T, V> = [V] extends [Date]
  ? [T] extends [string]
    ? V
    : never
  : never;
type RemoveDateType<T> = Exclude<T, Date>;

type ExtractModelValue<RawProp, ModelProp> = RawProp extends ModelProp
  ? ModelProp extends string | boolean | number | null | undefined
    ? RemoveDateType<ModelProp>
    : RawProp extends Array<infer S>
      ? S extends AnyModel
        ? Self<S>[]
        : S[]
      : RawProp extends { get maybeCurrent(): infer S }
        ? ModelProp extends { get maybeCurrent(): infer S }
          ? string
          : never
        : RawProp extends AnyModel
          ? ModelProp extends AnyModel
            ? Self<RawProp>
            : never
          : never
  : IsCoercedDate<Exclude<RawProp, null>, Exclude<ModelProp, null>>;

export type Self<T extends AnyModel> = {
  [K in keyof Omit<T["$"], BaseModelKeys>]: ExtractModelValue<T["$"][K], T[K]>;
};

export interface RefPointer<T extends object, P extends keyof T> {
  ref: RefConstructor<T>;
  pointer: P;
}

export type AnyKV = { [key: string]: unknown };
