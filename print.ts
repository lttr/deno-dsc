import { Configuration } from "./configuration.ts";
import { jsonTree } from "./deps.ts";
import {
  createRootNode,
  constructDependenciesTree,
  removeBackreferences
} from "./graph.ts";

export async function printConfigurationSet(
  configurationSet: Configuration[]
): Promise<void> {
  const root = createRootNode();
  // addDefaultDependsOn(configurationSet, root);
  constructDependenciesTree(configurationSet);
  await removeBackreferences(root);
  console.log(jsonTree(root, true, true));
}
