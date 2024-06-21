import { computed } from "mobx";
import {
  Model,
  Ref,
  SnapshotInOf,
  fromSnapshot,
  getRootStore,
  isoStringToDateTransform,
  modelAction,
  prop,
} from "mobx-keystone";

import { BaseModelInstance, IBaseModel } from "./base-model";
import { ISingletonModel, SingletonModelInstance } from "./singleton-model";
import { AnyKV } from "./types";

export type TwonaModel = IBaseModel | ISingletonModel;
export type TwonaModelInstance = BaseModelInstance | SingletonModelInstance;

interface StoreProps<T extends TwonaModelInstance> {
  _data: T[];
  selected: Ref<T>[];
  hidden: Ref<T>[];
  lastSync: Date;
  loading: boolean;
  syncing: boolean;
  errorInCreation: boolean;
}

export abstract class StoreModel<T extends TwonaModelInstance>
  extends Model(<T extends TwonaModelInstance>() => ({
    _data: prop<T[]>(() => []),
    selected: prop<Ref<T>[]>(() => []),
    hidden: prop<Ref<T>[]>(() => []),
    loading: prop<boolean>().withSetter(),
    syncing: prop<boolean>().withSetter(),
    errorInCreation: prop<boolean>(false),
    lastSync: prop<string>()
      .withTransform(isoStringToDateTransform())
      .withSetter(),
  }))<T>
  implements StoreProps<T>
{
  @computed
  get root() {
    return getRootStore(this);
  }

  @computed
  get data() {
    return this._data.filter((d) => !this.hidden.includes(d.$modelId));
  }

  @modelAction
  page(page = 0, chunkSize = 50) {
    const start = page * chunkSize;
    const end = start + chunkSize;
    if (start > this.data.length) return [];
    return this.data.slice(start, end);
  }

  @modelAction
  setData(data: T[]) {
    this._data = data;
  }

  @modelAction
  setRaw(data: SnapshotInOf<T>[]) {
    this._data = data.map((datum) => fromSnapshot<T>(datum));
  }

  @modelAction
  addRaw(data: SnapshotInOf<T>[]) {
    this._data.concat(data.map((datum) => fromSnapshot<T>(datum)));
  }

  @modelAction
  clearData() {
    this._data = [];
  }

  public byId(id: string): T | undefined {
    return this.data.find((d) => d.$modelId === id);
  }

  @modelAction
  public hide(item: string | T) {
    const ref = this.ref(item);
    if (!this.hidden.includes(ref)) this.hidden.push(ref);
  }

  @modelAction
  public unhide(item: string | T) {
    const ref = this.ref(item);
    const refIndex = this.hidden.indexOf(ref);
    if (~refIndex) {
      this.hidden.splice(refIndex, 1);
    }
  }
}

export type IStoreModel = typeof StoreModel & AnyKV;
export type StoreModelInstance = InstanceType<IStoreModel> & AnyKV;
