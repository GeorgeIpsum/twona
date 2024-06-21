import { computed, observable } from "mobx";
import {
  Model,
  getParent,
  getRootStore,
  idProp,
  isoStringToDateTransform,
  prop,
} from "mobx-keystone";

import type { AnyKV, Self } from "./types";

export abstract class BaseModel extends Model({
  id: idProp,
  createdAt: prop<string>().withTransform(isoStringToDateTransform()),
  updatedAt: prop<string>().withTransform(isoStringToDateTransform()),
}) {
  @observable
  loading = false;

  @observable
  syncing = false;

  @observable
  error: Error | null = null;

  @computed
  get root() {
    return getRootStore(this);
  }

  @computed
  get parent() {
    const firstParent = getParent(this);
    if (Array.isArray(firstParent)) {
      return getParent(firstParent);
    }
    return firstParent;
  }

  @computed
  get isInStore() {
    return this.parent?.$modelType.includes("Store");
  }

  @computed
  get isSelected() {
    if (this.isInStore) {
      return Boolean(
        this.parent.selected.find(
          (d: Self<this> & { id: unknown }) => d.id === this.$modelId,
        ),
      );
    }
    return false;
  }

  protected onInit(): void {
    if (typeof this.createdAt === "string")
      this.createdAt = new Date(this.createdAt);
    if (typeof this.updatedAt === "string")
      this.updatedAt = new Date(this.updatedAt);
    return;
  }

  abstract setSelf(self: Self<this>): void;
}

export type IBaseModel = typeof BaseModel & AnyKV;
export type BaseModelInstance = InstanceType<IBaseModel> & AnyKV;
