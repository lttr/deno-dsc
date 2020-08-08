import { Config, WithDependencies } from "./configuration.ts";
import { log } from "./deps.ts";
import {
  breadthFirst,
  constructDependenciesTree,
  createRootNode,
  unwrapConfig
} from "./graph.ts";

export interface RunOptions {
  verbose?: boolean;
  dryRun?: boolean;
}

export async function runConfigurationSet(
  configurationSet: Config[],
  options: RunOptions = {}
): Promise<void> {
  const { verbose = false, dryRun = false } = options;
  const givenConfigsCount = configurationSet.length;
  let testsCounter = 0;
  let setsCounter = 0;
  async function run(config: Config) {
    if (config.dependsOn != null) {
    }
    const result = await config.resource?.test(config, verbose);
    testsCounter += 1;
    if (dryRun) {
      log.info(
        `${result ? "Do not" : "Do"} run '${config.resource?.get(config)}'`
      );
    } else {
      if (!result) {
        await config.resource?.set(config, verbose);
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
    `Given ${givenConfigsCount} configs. Ran ${testsCounter} tests and ${setsCounter} sets.`
  );
}
