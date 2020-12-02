import regexparam from 'regexparam';

interface RouteItem {
  route: RegExp;
  guard: () => boolean;
}

const routes: RouteItem[] = [];
export const context = new Map<string, any>();

// TODO: change guard: () => boolean
export function register(route: string, guard: () => boolean): void {
  routes.push({
    route: regexparam(route).pattern,
    guard,
  });
}

export function check(route: string): boolean {
  context.clear();
  for (const item of routes) {
    if (item.route.test(route)) {
      return item.guard();
    }
  }
  // Route not registered
  return true;
}
