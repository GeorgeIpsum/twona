// TODO: find where you got the source of this code from and paste the link here
import { type Express } from "express";
import path from "node:path";

const COLORS = {
  yellow: 33,
  green: 32,
  blue: 34,
  red: 31,
  grey: 90,
  magenta: 35,
  teal: 36,
  clear: 39,
};

const spacer = (x: number) =>
  x > 0 ? [...new Array(x)].map(() => " ").join("") : "";

const colorText = (color: number, string: string) =>
  `\u001b[${color}m${string}`;

function colorMethod(method: string) {
  switch (method) {
    case "POST":
      return colorText(COLORS.yellow, method);
    case "GET":
      return colorText(COLORS.green, method);
    case "PUT":
      return colorText(COLORS.blue, method);
    case "DELETE":
      return colorText(COLORS.red, method);
    case "PATCH":
      return colorText(COLORS.grey, method);
    case "ALL":
      return colorText(COLORS.teal, method);
    default:
      return method;
  }
}

function getPathFromRegex(regexp: RegExp) {
  return regexp
    .toString()
    .replace("/^", "")
    .replace("?(?=\\/|$)/i", "")
    .replace(/\\\//g, "/")
    .replace("(?:/(?=$))", "");
}

function combineStacks(acc: any[], stack: any) {
  if (stack.handle.stack) {
    const routerPath = getPathFromRegex(stack.regexp);
    return [
      ...acc,
      ...stack.handle.stack.map((stack: any) => ({ routerPath, ...stack })),
    ];
  }
  return [...acc, stack];
}

function getStacks(app: Express) {
  // Express 4
  if (app._router && app._router.stack) {
    return app._router.stack.reduce(combineStacks, []);
  }

  // Express 4 Router
  if (app.stack) {
    return app.stack.reduce(combineStacks, []);
  }

  // // Express 5
  // if (app.router && app.router.stack) {
  //   return app.router.stack.reduce(combineStacks, []);
  // }

  return [];
}

interface ListRouteOpts {
  prefix?: string;
  spacer: number;
  color?: boolean;
}
const defaultOptions: ListRouteOpts = {
  prefix: "",
  spacer: 5,
  color: true,
};
export function getExpressRoutes(app: Express, opts?: ListRouteOpts) {
  const stacks = getStacks(app);
  const options = { ...defaultOptions, ...opts };
  const paths = [];

  if (stacks) {
    for (const stack of stacks) {
      if (stack.route) {
        const routeLogged: Record<string, boolean> = {};
        for (const route of stack.route.stack) {
          const method = route.method ? route.method.toUpperCase() : "ALL";
          if (!routeLogged[method] && method) {
            const stackMethod = options.color ? colorMethod(method) : method;
            const stackSpace = spacer(options.spacer - method.length);
            const stackPath = path
              .normalize(
                [options.prefix, stack.routerPath, stack.route.path, route.path]
                  .filter((s) => !!s)
                  .join(""),
              )
              .trim();
            // options.logger(stackMethod, stackSpace, stackPath);
            paths.push({ method, path: stackPath, stackMethod, stackSpace });
            routeLogged[method] = true;
          }
        }
      } else if (stack.name === "superTokensMiddleware") {
        const method = "ALL";
        const stackMethod = options.color ? colorMethod(method) : method;
        const stackSpace = spacer(options.spacer - method.length);
        const stackPath = path.normalize(
          [options.prefix, "/auth/"].filter((s) => !!s).join(""),
        );
        paths.push({ method: "ALL", path: stackPath, stackMethod, stackSpace });
      }
    }
  }

  return paths;
}

export function fmtRoutes(routes: ReturnType<typeof getExpressRoutes>) {
  return routes.map((r) => `⚡️ ${r.stackMethod}${r.stackSpace}${r.path}`);
}
