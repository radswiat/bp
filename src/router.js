import chalk from 'chalk';

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
      new routes.default(action);
      return;
    }

    if (typeof routes[action] !== 'function') {
      console.log(chalk.redBright(`Unknown action: ${chalk.red(action)}`));
      new routes.help(action);
      return;
    }

    new routes[action](action);
  }
};
