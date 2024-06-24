import Store, { Schema } from "electron-store";

import { Theme } from "./theme";

const sqlitePrisma: typeof import("db/sqlite") = require("db/sqlite");

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
const db = new sqlitePrisma.PrismaClient();

export { db, Store };

export default store;
