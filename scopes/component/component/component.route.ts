import { NextFunction, Request, Response, Route } from '@teambit/express';

import { ComponentMain } from './component.main.runtime';

export class ComponentRoute implements Route {
  constructor(private registerRoute: Route, private componentExtension: ComponentMain) {}
  dynamicRouteRegex = '/?[^/@]+/[^~]*';
  readonly route = `/:componentId(${this.dynamicRouteRegex})/~aspect${this.registerRoute.route}`;

  get componentMiddlewares() {
    return [
      async (req: Request, res: Response, next: NextFunction) => {
        const { componentId } = req.params;
        const host = this.componentExtension.getHost();
        const compId = await host.resolveComponentId(componentId);
        const component = await host.get(compId);
        // @ts-ignore
        req.component = component;
        next();
      },
    ];
  }

  method = this.registerRoute.method;
  middlewares = this.componentMiddlewares.concat(this.registerRoute.middlewares);
}
