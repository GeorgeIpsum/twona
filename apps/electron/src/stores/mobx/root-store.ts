import {
  ActionCall,
  Model,
  SimpleActionContext,
  isoStringToDateTransform,
  model,
  modelAction,
  onActionMiddleware,
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

interface DebugAction {
  actionCall: ActionCall;
  actionContext: SimpleActionContext;
}
const __DEBUG__ACTIONS__: any[] = [];
export const getDebugActions = (
  filter: (action: DebugAction, index: number, array: DebugAction[]) => boolean,
) => (filter ? __DEBUG__ACTIONS__.filter(filter) : __DEBUG__ACTIONS__);

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

  onActionMiddleware(rootStore, {
    onStart(actionCall, actionContext) {
      __DEBUG__ACTIONS__.push({ actionCall, actionContext });
      return undefined;
    },
    onFinish(actionCall, actionContext) {
      return undefined;
    },
  });

  return rootStore;
}
