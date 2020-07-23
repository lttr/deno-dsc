import { Config, WithDependencies } from "./configuration.ts";
import {
  createRootNode,
  constructDependenciesTree,
  breadthFirst,
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
  async function run(config: Config) {
    if (config.dependsOn != null) {
    }
    const result = await config.resource?.test(config, verbose);
    if (dryRun) {
      console.log(
        `${result ? "Do not" : "Do"} run '${config.resource?.get(config)}'`
      );
    } else {
      if (!result) {
        await config.resource?.set(config, verbose);
      }
    }
  }
  const root: Config = createRootNode();
  constructDependenciesTree(unwrapConfig(configurationSet, root));
  if (root.dependencies) {
    await breadthFirst<WithDependencies>(root as WithDependencies, run);
  }
}
