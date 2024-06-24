import { createContext, useContext } from "react";

import { getSnapshot, setGlobalConfig } from "mobx-keystone";

import { RootStore, init } from "./mobx/root-store";

setGlobalConfig({
  showDuplicateModelNameWarnings: !import.meta.env.DEV,
});

class Server {
  private root: RootStore;

  constructor() {
    this.root = init();
  }

  getInitialState() {
    return getSnapshot(this.root);
  }

  getRoot() {
    return this.root;
  }
}

const RootStoreContext = createContext<RootStore | null>(null);
export const RootProvider = RootStoreContext.Provider;
export const useRoot = () => useContext(RootStoreContext);

export const CANCELLED = Symbol("CANCELLED_ACTION");

export const server = new Server();
