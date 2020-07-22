import { Configuration, WithDependencies } from "./configuration.ts";
import {
  createRootNode,
  constructDependenciesTree,
  breadthFirst
} from "./graph.ts";

export async function runConfigurationSet(
  configurationSet: Configuration[],
  { verbose } = {
    verbose: true
  }
): Promise<void> {
  async function run(config: Configuration) {
    if (config.dependsOn != null) {
    }
    const result = await config.resource?.test(config, verbose);
    if (!result) {
      await config.resource?.set(config, verbose);
    }
  }
  const root: Configuration = createRootNode();
  // addDefaultDependsOn(configurationSet, root);
  constructDependenciesTree(configurationSet);
  if (root.dependencies) {
    breadthFirst<WithDependencies>(root as WithDependencies, run);
  }
}
