import regexparam from 'regexparam';

interface RouteItem {
  route: RegExp;
  guard: () => boolean;
}

let routes: RouteItem[] = [];

// TODO: change guard: () => boolean
export function register(route: string, guard: () => boolean) {
  routes.push(
    {
      route: regexparam(route).pattern,
      guard
    }
  );
}

export function check(route: string): boolean {
  for (const item of routes) {
    if (item.route.test(route)) {
      return item.guard();
    }
  }
  // Route not registered
  return true;
}
