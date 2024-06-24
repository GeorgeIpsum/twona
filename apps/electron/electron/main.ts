import { registerIpcMain } from "@egoist/tipc/main";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { BrowserWindow, app } from "electron";
import windowStateKeeper, { type State } from "electron-window-state";
import path from "node:path";

import store, { Store } from "./store";
// import { getNativeTheme } from "./theme";
import { router } from "./tipc";

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
  Store.initRenderer();

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
      preload: path.join(__dirname, "../preload/preload.mjs"),
      sandbox: false,
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
    // win?.webContents.send("main-process-message", new Date().toLocaleString());
    // win?.webContents.send("main-process-message", getNativeTheme());
    setTimeout(() => {
      splash?.close();
      win?.show();
    }, 1000);
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(path.join(__dirname, "../index.html"));
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
