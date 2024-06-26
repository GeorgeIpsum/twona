import { computed } from "mobx";
import {
  ArraySet,
  Model,
  ObjectMap,
  Ref,
  SnapshotInOf,
  fromSnapshot,
  getRootStore,
  isoStringToDateTransform,
  modelAction,
  objectMap,
  prop,
} from "mobx-keystone";

import { BaseModelInstance, IBaseModel } from "./base-model";
import { NSStoreName, buildRef, getStoreBaseModelName } from "./namespace";
import { ISingletonModel, SingletonModelInstance } from "./singleton-model";
import { AnyKV } from "./types";

export type TwonaModel = IBaseModel | ISingletonModel;
export type TwonaModelInstance = BaseModelInstance | SingletonModelInstance;

interface StoreProps<T extends TwonaModelInstance> {
  _data: ArraySet<T>;
  selected: ObjectMap<Ref<T>>;
  hidden: ObjectMap<Ref<T>>;
  lastSync: Date;
  loading: boolean;
  syncing: boolean;
  errorInCreation: boolean;
}

export abstract class StoreModel<T extends TwonaModelInstance>
  extends Model(<T extends TwonaModelInstance>() => ({
    _data: prop<ArraySet<T>>(() => new ArraySet([])),
    selected: prop<ObjectMap<Ref<T>>>(() => objectMap<Ref<T>>()),
    hidden: prop<ObjectMap<Ref<T>>>(() => objectMap<Ref<T>>()),
    loading: prop<boolean>().withSetter(),
    syncing: prop<boolean>().withSetter(),
    errorInCreation: prop<boolean>(false),
    lastSync: prop<string>()
      .withTransform(isoStringToDateTransform())
      .withSetter(),
  }))<T>
  implements StoreProps<T>
{
  baseModelName = getStoreBaseModelName(this.$modelType as NSStoreName<string>);
  ref = buildRef<T>(this.baseModelName);

  @computed
  get root() {
    return getRootStore(this);
  }

  @computed
  get data() {
    return new ArraySet(
      this._data.items.filter((datum) => !this.hidden.has(datum.$modelId)),
    );
  }

  @modelAction
  page(page = 0, chunkSize = 50) {
    const start = page * chunkSize;
    const end = start + chunkSize;

    if (start > this.data.items.length) return [];
    return this.data.items.slice(start, end);
  }

  @modelAction
  setData(data: T[]) {
    this._data = new ArraySet(data);
  }

  @modelAction
  setRawData(data: SnapshotInOf<T>[]) {
    this._data = new ArraySet(data.map((datum) => fromSnapshot<T>(datum)));
  }

  @modelAction
  addRawData(data: SnapshotInOf<T>[]) {
    data.forEach((datum) => {
      this._data.add(fromSnapshot<T>(datum));
    });
  }

  @modelAction
  clearData() {
    this._data = new ArraySet([]);
  }

  public byId(id: string, includeHidden = false): T | undefined {
    return includeHidden ? this._data[id] : this.data[id];
  }

  @modelAction
  public hide(item: string | T) {
    const ref = this.ref(item);
    if (!this.hidden.has(ref.$modelId)) {
      this.hidden.set(ref.$modelId, ref);
      return true;
    }
    return false;
  }

  @modelAction
  public unhide(item: string | T) {
    const ref = this.ref(item);
    if (this.hidden.has(ref.$modelId)) {
      this.hidden.delete(ref.$modelId);
      return true;
    }
    return false;
  }

  @modelAction
  public select(item: string | T) {
    const ref = this.ref(item);
    if (!this.selected.has(ref.$modelId)) {
      this.selected.set(ref.$modelId, ref);
      return true;
    }
    return false;
  }

  @modelAction
  public deselect(item: string | T) {
    const ref = this.ref(item);
    if (this.selected.has(ref.$modelId)) {
      this.selected.delete(ref.$modelId);
      return true;
    }
    return false;
  }
}

export type IStoreModel = typeof StoreModel & AnyKV;
export type StoreModelInstance = InstanceType<IStoreModel> & AnyKV;
