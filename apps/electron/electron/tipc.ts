import { tipc } from "@egoist/tipc/main";
import { BrowserWindow } from "electron";

import { db } from "./store";

const t = tipc.create();
const procedure = t.procedure;

export const router = {
  getCsrfToken: procedure.action(async () => {
    const { csrfToken } = await fetch("http://localhost:3000/auth/csrf").then(
      (res) => res.json(),
    );

    return csrfToken;
  }),
  getIntegrations: procedure.action(async () => {
    return db.integration.findMany();
  }),
  signInWithProvider: procedure
    .input<string>()
    .action(async ({ input: provider }) => {
      const { csrfToken } = await fetch("http://localhost:3000/auth/csrf").then(
        (res) => res.json(),
      );

      const form = {
        csrfToken,
        // callbackUrl: "http://localhost:3000",
      };

      const formBody: string[] = [];
      for (const prop in form) {
        if (Object.hasOwnProperty.call(form, prop)) {
          const encodedKey = encodeURIComponent(prop);
          const encodedValue = encodeURIComponent(
            form[prop as keyof typeof form],
          );
          formBody.push(`${encodedKey}=${encodedValue}`);
        }
      }

      const d = await fetch(
        `http://localhost:3000/auth/signin/${provider}?csrfToken=${csrfToken}`,
        {
          method: "POST",
          headers: {
            "x-csrf-token": csrfToken,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            cookie: `authjs.callback-url=http%3A%2F%2Flocalhost%3A3000; authjs.csrf-token=${csrfToken}`,
          },
          body: formBody.join("&"),
        },
      );

      const f = new BrowserWindow({
        transparent: false,
        frame: true,
        center: true,
        hasShadow: false,
      });

      f.webContents.openDevTools();

      const c = await d.text();

      f.hide();

      f.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(c)}`);

      f.show();

      return null;
    }),
};

export type Router = typeof router;
