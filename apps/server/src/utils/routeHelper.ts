import { Router, type Request, type Response, type NextFunction } from "express";

const createRoute = (router: Router, route: any, path: string) => {
  const middlewares = route.middleware || [];
  const errorHandlers = route.errorHandler ? route.errorHandler : [];

  // Accessing router method dynamically
  (router as any)[route.method](
    path,
    ...middlewares,
    route.controller,
    ...errorHandlers
  );
};

const routeHelper = (
  router: Router,
  pathSegments: string[],
  route: any,
  endPoint = "method"
) => {
  const path = `/${pathSegments.join("/")}`;

  if (route["middleware"] && !route[endPoint]) {
    router.use(path, route["middleware"]);
  }

  if (Array.isArray(route)) {
    for (const ro of route) {
      if (ro[endPoint]) {
        const newpath = path.replace("//", "/");
        createRoute(router, ro, newpath);
      }
    }
    return;
  }

  if (route[endPoint]) {
    createRoute(router, route, path);
    return;
  }

  let dynamicRoute = "";

  for (const key of Object.keys(route)) {
    if (key[0] !== ":") {
      pathSegments.push(key);
      routeHelper(router, pathSegments, route[key], endPoint);
      pathSegments.pop();
    } else {
      dynamicRoute = key;
    }
  }

  // register dynamic route
  if (dynamicRoute) {
    pathSegments.push(dynamicRoute);
    routeHelper(router, pathSegments, route[dynamicRoute], endPoint);
    pathSegments.pop();
  }
};

const registerRoutes = (routes: any): Router => {
  const router = Router();
  const pathSegments: string[] = [];
  routeHelper(router, pathSegments, routes);
  return router;
};

export default registerRoutes;
