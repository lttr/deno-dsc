import type { Config, WithDependencies } from "./configuration.ts";
import { log } from "./deps.ts";
import {
  breadthFirst,
  constructDependenciesTree,
  createRootNode,
  unwrapConfig,
} from "./graph.ts";

export interface RunOptions {
  verbose?: boolean;
  dryRun?: boolean;
  filter?: string;
}

export async function runConfigurationSet(
  configurationSet: Config[],
  options: RunOptions = {},
): Promise<void> {
  const { verbose = false, dryRun = false, filter } = options;
  const givenConfigsCount = configurationSet.length;
  let testsCounter = 0;
  let setsCounter = 0;
  async function run(config: Config) {
    if (config.dependsOn != null) {
      // TODO what is this branch for?
    }
    // Skip this action if a filter contains something else
    if (filter && filter !== config.resource?.name) {
      return;
    }
    const result = await config.resource?.test(config, verbose);
    testsCounter += 1;
    if (dryRun) {
      const description = config.resource?.get(config);
      log.info(`${result ? "Would not" : "Would"} run '${description}'`);
    } else {
      if (!result) {
        log.info(`Starting '${config.resource?.get(config)}'`);
        const start = new Date();
        await config.resource?.set(config, verbose);
        const duration = new Date().getTime() - start.getTime();
        log.info(`Done in ${(duration / 1000).toFixed(1)}s`);
        setsCounter += 1;
      }
    }
  }
  const root: Config = createRootNode();
  constructDependenciesTree(unwrapConfig(configurationSet, root));
  if (root.dependencies) {
    await breadthFirst<WithDependencies>(root as WithDependencies, run);
  }
  log.info(
    // subtract START node from the number of tests
    `Given ${givenConfigsCount} configs. Ran ${
      testsCounter -
      1
    } tests and ${setsCounter} sets.`,
  );
}
