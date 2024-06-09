declare namespace Bluefin {
  type Request = import("express").Request;
  type Response = import("express").Response;
  type NextFunction = import("express").NextFunction;
  type Handler = (req: Request, res: Response, next: NextFunction) => void;
  type Express = import("express").Express;
  type Locals = import("express").Locals;
  type ExpressSetup = (app: Express) => void;

  interface Config {
    readonly version: string;
  }

  type Route = `/${string}/*` | `/${string}`;
  type RoutePath<R extends Route> = R extends `${infer P}/*`
    ? P
    : R extends `${infer Q}`
      ? Q
      : R;

  interface Deba {
    setup?: Handler;
    check: Handler;
  }

  interface Sakai {
    setup?: ExpressSetup;
    routes: Record<Route, Handler>;
  }
}
