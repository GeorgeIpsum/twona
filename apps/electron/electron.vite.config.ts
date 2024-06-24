import react from "@vitejs/plugin-react";
import {
  bytecodePlugin,
  defineConfig,
  defineViteConfig,
  externalizeDepsPlugin,
} from "electron-vite";
import { resolve } from "node:path";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  main: {
    build: {
      lib: {
        entry: "electron/main.ts",
      },
    },
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
  },
  preload: {
    build: {
      lib: {
        entry: "electron/preload.ts",
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: defineViteConfig({
    root: "src",
    build: {
      lib: {
        entry: "src/index.html",
      },
      rollupOptions: {
        input: "src/index.html",
      },
    },
    resolve: {
      alias: {
        "~": resolve("src"),
      },
    },
    plugins: [
      svgr({
        svgrOptions: {
          plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
          svgoConfig: {
            plugins: [
              "preset-default",
              "removeTitle",
              "removeDesc",
              "removeDoctype",
              "cleanupIds",
              "removeUselessDefs",
            ],
          },
        },
      }),
      react(),
      tsconfigPaths(),
    ],
    define: {},
  }),
});
