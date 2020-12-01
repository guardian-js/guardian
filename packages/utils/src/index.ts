import { check, register } from '@guardianjs/core';

export function registerRoutes(routes: { route: string; guard: () => boolean }[]): void {
  routes.forEach(({ route, guard }) => {
    register(route, guard);
  });
}

type Fn = (...args: any[]) => any;

export function wrap(route: string, f: Fn): Fn {
  return (...args: any[]) => {
    if (check(route)) {
      return f(...args);
    } else {
      // TODO: Change this.
      throw new Error('Permission denied');
    }
  };
}
