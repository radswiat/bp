import argv from 'helpers/argv';

import { isDefined } from 'utils';

import * as routes from 'routes';

export default new class Router {

  init() {
    this.handleDynamicRoutes();
  }

  handleDynamicRoutes() {
    const action = argv.getAction();

    // handle default action - no action given
    if (!isDefined(action)) {
      new routes.default();
      return;
    }

    if (typeof routes[action] !== 'function') {
      console.log(`unknown command ${action}`);
      return;
    }

    new routes[action]();
  }
}
