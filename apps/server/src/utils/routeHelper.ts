import { Router, type ErrorRequestHandler, type RequestHandler } from "express";

type RouteMethod = "get" | "post" | "put" | "patch" | "delete";

interface RouteDefinition {
  method: RouteMethod;
  middleware?: RequestHandler[];
  controller: RequestHandler;
  errorHandler?: ErrorRequestHandler[];
}

interface RouteMap {
  middleware?: RequestHandler[];
  [segment: string]: RouteNode | RequestHandler[] | undefined;
}

type RouteNode = RouteDefinition | RouteDefinition[] | RouteMap;

const isRouteDefinition = (route: RouteNode): route is RouteDefinition =>
  (
    typeof route === "object" && !Array.isArray(route) && "method" in route
  );

const isRouteMap = (route: RouteNode): route is RouteMap =>
  (
    typeof route === "object" && !Array.isArray(route) && !("method" in route)
  );

const isRouteNode = (route: RouteMap[string]): route is RouteNode => {
  if (!route) {
    return false;
  }

  if (Array.isArray(route)) {
    return route.every((item) => "method" in item);
  }

  return true;
};

const createRoute = (router: Router, route: RouteDefinition, path: string) => {
  const middlewares = route.middleware ?? [];
  const errorHandlers = route.errorHandler ?? [];

  // switch (route.method) {
  //   case "get":
  //     router.get(path, ...middlewares, route.controller, ...errorHandlers);
  //     break;
  //   case "post":
  //     router.post(path, ...middlewares, route.controller, ...errorHandlers);
  //     break;
  //   case "put":
  //     router.put(path, ...middlewares, route.controller, ...errorHandlers);
  //     break;
  //   case "patch":
  //     router.patch(path, ...middlewares, route.controller, ...errorHandlers);
  //     break;
  //   case "delete":
  //     router.delete(path, ...middlewares, route.controller, ...errorHandlers);
  //     break;
  // }

  router[route.method](
    path,
    ...middlewares,
    route.controller,
    ...errorHandlers,
  );
};

const routeHelper = (
  router: Router,
  pathSegments: string[],
  route: RouteNode,
) => {
  const path = `/${pathSegments.join("/")}`;

  if (isRouteMap(route) && route.middleware) {
    router.use(path, route.middleware);
  }

  if (Array.isArray(route)) {
    for (const ro of route) {
      const newpath = path.replace("//", "/");
      createRoute(router, ro, newpath);
    }
    return;
  }

  if (isRouteDefinition(route)) {
    createRoute(router, route, path);
    return;
  }

  let dynamicRoute = "";

  for (const key of Object.keys(route)) {
    if (key === "middleware") {
      continue;
    }

    if (key[0] !== ":") {
      const nextRoute = route[key];
      if (!isRouteNode(nextRoute)) {
        continue;
      }

      pathSegments.push(key);
      routeHelper(router, pathSegments, nextRoute);
      pathSegments.pop();
    } else {
      dynamicRoute = key;
    }
  }

  // register dynamic route
  if (dynamicRoute) {
    pathSegments.push(dynamicRoute);
    const nextRoute = route[dynamicRoute];
    if (isRouteNode(nextRoute)) {
      routeHelper(router, pathSegments, nextRoute);
    }
    pathSegments.pop();
  }
};

const registerRoutes = (routes: RouteNode): Router => {
  const router = Router();
  const pathSegments: string[] = [];
  routeHelper(router, pathSegments, routes);
  return router;
};

export default registerRoutes;
