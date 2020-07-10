// Configurations define and configure instances of resources.
// Resources make it so.

export interface Resource<T extends Configuration> {
  name: string;
  get: (configuration: T) => string;
  set: (configuration: T, verbose: boolean) => Promise<void>;
  test: (configuration: T, verbose: boolean) => Promise<boolean>;
}

export interface Configuration {
  dependencies?: Array<Configuration>;
  dependsOn?: Configuration;
  ensure?: "present" | "absent";
  resource: Resource<Configuration>;
}
