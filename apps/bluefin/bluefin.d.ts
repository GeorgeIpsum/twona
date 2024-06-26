declare namespace Bluefin {
  type Request = import("express").Request;
  type Response = import("express").Response;
  type NextFunction = import("express").NextFunction;

  type Express = import("express").Express;
  type Router = import("express").Router;
  type Locals = import("express").Locals;

  type Handler = (req: Request, res: Response, next: NextFunction) => void;

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
    preSetup?: ExpressSetup;
    setup?: Handler;
    check: Handler;
    postSetup?: ExpressSetup;
  }

  interface Sakai {
    routes: Route | Route[];
    setup?: ExpressSetup;
    router: Router;
  }
}
