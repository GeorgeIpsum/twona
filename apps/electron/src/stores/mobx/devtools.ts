import { connectReduxDevTools } from "mobx-keystone";

export const setupDevTools = (rootStore: object) => {
  if (import.meta.env.DEV) {
    // @ts-expect-error no declaration file for remotedev
    import("remotedev").then((remotedev) => {
      const connection = remotedev.connect({
        name: "2NA",
        host: "localhost",
        port: "5174",
      });
      connectReduxDevTools(remotedev, connection, rootStore);
    });
  }
};
