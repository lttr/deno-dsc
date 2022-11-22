import { Config, WithDependencies } from "./configuration.ts";
import { depGraph } from "./dep-graph/dep-graph.ts";
import { lookupResource } from "./resource.ts";

export function showDepGraph(configurationSet: Config[]): void {
  const root = createRootNode();
  const unwrappedConfiguration = unwrapConfig(configurationSet, root);
  depGraph(unwrappedConfiguration);
}

export function unwrapConfig(
  configurationSet: Config[],
  defaultDependsOn: Config,
): Config[] {
  return configurationSet.map((wrappedConfiguration) => {
    const { key, unwrappedConfiguration } = unwrapItem(wrappedConfiguration);
    const resource = lookupResource(key);
    unwrappedConfiguration.resource = resource;
    if (unwrappedConfiguration.dependsOn) {
      unwrappedConfiguration.dependsOn = unwrapItem(
        unwrappedConfiguration.dependsOn,
      ).unwrappedConfiguration;
    } else {
      unwrappedConfiguration.dependsOn = defaultDependsOn;
    }
    return unwrappedConfiguration;
  });
}

function unwrapItem(wrappedConfiguration: Config) {
  const key = Object.keys(wrappedConfiguration)[0] as keyof Config;
  const unwrappedConfiguration = wrappedConfiguration[key] as any;
  return { key, unwrappedConfiguration };
}

export async function removeBackreferences(root: Config) {
  function removeDependsOn(config: Config) {
    delete config.dependsOn;
  }
  if (root.dependencies) {
    await breadthFirst<WithDependencies>(
      root as WithDependencies,
      removeDependsOn,
    );
  }
}

export function createRootNode(): Config {
  return {
    resource: {
      name: "root",
      get: (_c: Config) => "START",
      set: async () => {},
      test: async () => await Promise.resolve(true),
    },
    dependencies: [],
  };
}

export function constructDependenciesTree(configurationSet: Config[]) {
  for (const config of configurationSet) {
    if (config.dependsOn) {
      if (Array.isArray(config.dependsOn.dependencies)) {
        config.dependsOn.dependencies.push(config);
      } else {
        config.dependsOn.dependencies = [config];
      }
    }
  }
}

export async function breadthFirst<T extends WithDependencies>(
  node: T,
  action: (node: Config) => Promise<void> | void,
) {
  const queue = new Queue<Config>(node);
  async function process(queue: Queue<Config>) {
    const node = queue.pop();
    if (node) {
      await action(node);
      if (Array.isArray(node.dependencies)) {
        for (const dependency of node.dependencies) {
          queue.push(dependency);
        }
      }
      if (queue.notEmpty()) {
        await process(queue);
      }
    }
  }
  await process(queue);
}

class Queue<T> {
  _array: T[] = [];

  constructor(firstItem: T) {
    if (firstItem != null) this.push(firstItem);
  }

  push(value: T) {
    this._array.push(value);
  }

  pop() {
    return this._array.shift();
  }

  notEmpty() {
    return this._array.length > 0;
  }
}
