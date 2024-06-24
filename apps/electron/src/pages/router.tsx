import { observer } from "mobx-react-lite";
import {
  type RouteObject,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";

import { isE } from "../utils/platform";
import HomePage from "./home/HomePage";

const createRouter = isE ? createHashRouter : createBrowserRouter;
const routerOpts: Parameters<typeof createRouter>[1] = {};

const routes: RouteObject[] = [
  {
    index: true,
    Component: HomePage,
  },
];

const router = createRouter(routes, routerOpts);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default observer(Router);
