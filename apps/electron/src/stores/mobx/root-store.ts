import {
  Model,
  isoStringToDateTransform,
  model,
  modelAction,
  prop,
  registerRootStore,
} from "mobx-keystone";

@model("RootStore")
export class RootStore extends Model({
  lastSync: prop<string | null>().withTransform(isoStringToDateTransform()),
}) {
  @modelAction
  setLastSync() {
    this.lastSync = new Date();
  }
}

export type IRootStore = typeof RootStore;
export type RootStoreInstance = InstanceType<IRootStore>;

let rootStore: RootStore | null = null;
export function init() {
  if (rootStore) {
    return rootStore;
  }

  rootStore = registerRootStore(
    new RootStore({
      lastSync: null,
    }),
  );

  return rootStore;
}
