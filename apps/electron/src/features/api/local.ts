import { createClient } from "@egoist/tipc/renderer";
import type { Router } from "electron/tipc";

export const client = createClient<Router>({
  ipcInvoke: window.ipcRenderer.invoke,
});
