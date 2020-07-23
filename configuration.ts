import {
  ResourceConfigurationMap,
  ResourceNames,
  Resource
} from "./resource.ts";

interface CommonConfigurationProperties {
  dependencies?: Config[];
  dependsOn?: Config;
  ensure?: "present" | "absent";
  resource?: Resource;
}

type ResourceSpecificConfiguration = {
  [ResourceName in ResourceNames]?: ResourceConfigurationMap[ResourceName];
};

export type Config = CommonConfigurationProperties &
  ResourceSpecificConfiguration;

export interface WithDependencies {
  dependencies: any[];
}
