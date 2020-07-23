import { Config } from "./configuration.ts";
import { jsonTree } from "./deps.ts";
import {
  createRootNode,
  constructDependenciesTree,
  removeBackreferences,
  unwrapConfig
} from "./graph.ts";

export async function printConfigurationSet(
  configurationSet: Config[]
): Promise<void> {
  const root = createRootNode();
  constructDependenciesTree(unwrapConfig(configurationSet, root));
  await removeBackreferences(root);
  console.log(jsonTree(root, true, true));
}
