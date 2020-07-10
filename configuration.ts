import { Configuration } from "./resource.ts";
import { jsonTree } from "./deps.ts";

export async function runConfigurationSet(
  configurationSet: Configuration[],
  { verbose } = {
    verbose: true
  }
) {
  async function run(config: Configuration) {
    if (config.dependsOn != null) {
    }
    const result = await config.resource.test(config, verbose);
    if (!result) {
      await config.resource.set(config, verbose);
    }
  }
  const root = createRootNode();
  addDefaultDependsOn(configurationSet, root);
  constructDependenciesTree(configurationSet);
  breadthFirst<Configuration>(root, run);
}

export async function printConfigurationSet(configurationSet: Configuration[]) {
  const root = createRootNode();
  addDefaultDependsOn(configurationSet, root);
  constructDependenciesTree(configurationSet);
  await removeBackreferences(root);

  console.log(jsonTree(root, true, true));
}

async function removeBackreferences(root: Configuration) {
  function removeDependsOn(config: any) {
    delete config.dependsOn;
  }
  await breadthFirst<Configuration>(root, removeDependsOn);
}

function createRootNode() {
  return {
    resource: {
      name: "root",
      get: (c: Configuration) => "this is root",
      set: async () => {},
      test: async () => true
    },
    dependencies: []
  };
}

function addDefaultDependsOn(
  configurationSet: Configuration[],
  defaultDependsOn: Configuration
) {
  for (const config of configurationSet) {
    if (!config.dependsOn) {
      config.dependsOn = defaultDependsOn;
    }
  }
}

function constructDependenciesTree(configurationSet: Configuration[]) {
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

async function breadthFirst<T extends { dependencies?: any[] }>(
  node: T,
  action: (node: T) => Promise<void> | void
) {
  const queue = new Queue(node);
  async function process(queue: Queue<T>) {
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
