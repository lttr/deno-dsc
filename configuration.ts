import { ResourceConfiguration, ResourceNames, Resource } from "./resource.ts";

export interface Configuration {
  dependencies?: Config[];
  dependsOn?: Config;
  ensure?: "present" | "absent";
  resource?: Resource;
}

export type ConfigurationItem = {
  [ResourceName in ResourceNames]?: ResourceConfiguration[ResourceName];
};

export type Config = Configuration & ConfigurationItem;

export interface WithDependencies {
  dependencies: any[];
}
