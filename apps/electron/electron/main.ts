import { registerIpcMain } from "@egoist/tipc/main";
import { BrowserWindow, app } from "electron";
import windowStateKeeper, { type State } from "electron-window-state";
import path from "node:path";
import { fileURLToPath } from "node:url";

import store from "./store";
import { getNativeTheme } from "./theme";
import { router } from "./tipc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

registerIpcMain(router);

const MIN_WIDTH = 960;
const MIN_HEIGHT = 720;

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let splash: BrowserWindow | null;
let mainWindowState: State;

function createWindow() {
  splash = new BrowserWindow({
    width: 450,
    height: 300,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile("splash.html");
  splash.center();
  splash.show();

  const initialTheme = store.get("theme");

  mainWindowState = windowStateKeeper({
    defaultWidth: MIN_WIDTH,
    defaultHeight: MIN_HEIGHT,
  });

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC!, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    darkTheme: initialTheme === "dark",
    x: mainWindowState.x,
    y: mainWindowState.y,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: false,
    show: false,
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
    win?.webContents.send("main-process-message", getNativeTheme());
    setTimeout(() => {
      splash?.close();
      win?.show();
    }, 1000);
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    splash = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("ready", () => {
  mainWindowState?.manage(win!);
});

app.whenReady().then(createWindow);
