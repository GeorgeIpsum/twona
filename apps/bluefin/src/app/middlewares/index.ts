import { type Express } from "express";

import auth from "./auth/ware";

export const wares: Bluefin.Deba[] = [auth];

export const setup = (app: Express) => {
  wares.forEach(({ setup }) => setup && app.use(setup));
};

export const preSetup = (app: Express) => {
  wares.forEach(({ preSetup }) => preSetup?.(app));
};

export const postSetup = (app: Express) => {
  wares.forEach(({ postSetup }) => postSetup?.(app));
};
