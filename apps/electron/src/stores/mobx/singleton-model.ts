import { ExtendedModel } from "mobx-keystone";

import { BaseModel } from "./base-model";
import { AnyKV } from "./types";

export abstract class SingletonModel extends ExtendedModel(BaseModel, {}) {
  errorInCreation = false;

  abstract get ready(): boolean;
  abstract get hydrationKey(): string;
  abstract hydrate(data: unknown): void;
}

export type ISingletonModel = typeof SingletonModel & AnyKV;
export type SingletonModelInstance = InstanceType<ISingletonModel> & AnyKV;
