import Store, { Schema } from "electron-store";
import { createRequire } from "node:module";

import { Theme } from "./theme";

const require = createRequire(import.meta.url);
const sqlitePrisma = require("db/sqlite");

export interface TwonaStoreSchema {
  theme: Theme;
}

export const STORE_KEYS: {
  [Key in Uppercase<keyof TwonaStoreSchema>]: keyof TwonaStoreSchema;
} = {
  THEME: "theme",
};

const schema: Schema<TwonaStoreSchema> = {
  theme: {
    type: "string",
    enum: ["light", "dark", "system"] as Theme[],
    default: "system" as Theme,
  },
};

const store = new Store<TwonaStoreSchema>({
  schema,
});
const sqlite = new sqlitePrisma.PrismaClient();

export { sqlite };

export default store;
