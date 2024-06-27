import { observer } from "mobx-react-lite";
import {
  type RouteObject,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";

import { AuthCallback } from "~/services/auth";

import { isE } from "../utils/platform";
import HomePage from "./home/HomePage";

const createRouter = isE ? createHashRouter : createBrowserRouter;
const routerOpts: Parameters<typeof createRouter>[1] = {};

const routes: RouteObject[] = [
  {
    index: true,
    Component: HomePage,
  },
  {
    path: "/auth/callback/:provider",
    Component: AuthCallback,
  },
];

const router = createRouter(routes, routerOpts);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default observer(Router);
