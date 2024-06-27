import { connectReduxDevTools } from "mobx-keystone";

export const setupDevTools = (rootStore: object) => {
  if (import.meta.env.DEV) {
    import("remotedev").then((remotedev) => {
      const connection = remotedev.connect({
        name: "2NA",
        host: "localhost",
        port: "5173",
      });
      connectReduxDevTools(remotedev, connection, rootStore);
    });
  }
};
