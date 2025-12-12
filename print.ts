import type { Config } from "./configuration.ts";
import { jsonTree } from "./deps.ts";
import {
  constructDependenciesTree,
  createRootNode,
  removeBackreferences,
  unwrapConfig,
} from "./graph.ts";

export async function printConfigurationSet(
  configurationSet: Config[],
): Promise<void> {
  const root = createRootNode();
  constructDependenciesTree(unwrapConfig(configurationSet, root));
  await removeBackreferences(root);
  console.log(jsonTree(root, true, true));
}

export function printStatsConfigurationSet(configurationSet: Config[]): void {
  console.log(`===== DSC stats =====`);
  console.log();

  const total = configurationSet.length;
  const setOfResources = new Set();
  const mapByResource = new Map();
  for (const item of configurationSet) {
    const key = Object.keys(item)[0];
    setOfResources.add(key);
    if (mapByResource.has(key)) {
      mapByResource.set(key, mapByResource.get(key) + 1);
    } else {
      mapByResource.set(key, 1);
    }
  }
  console.log(`There are ${total} items in the configuration set.`);

  console.log();
  console.log(`${setOfResources.size} different resources are used:`);
  if (setOfResources.size > 0) {
    const sortedResources = [...setOfResources].sort();
    for (const resourceName of sortedResources) {
      console.log(`  * ${resourceName}`);
    }

    console.log();
    console.log(`Sorted by usage:`);
    const sortedResourcesWithCount = [...mapByResource.entries()]
      .sort((a, b) => a[0].localeCompare(b[0])) // sort by name
      .sort((a, b) => b[1] - a[1]); // sort by number of occurances
    for (const resourceTuple of sortedResourcesWithCount) {
      console.log(`  * ${resourceTuple[0]}: ${resourceTuple[1]}x`);
    }
  }
}
