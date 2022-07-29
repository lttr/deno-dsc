import {
  Resource,
  ResourceConfigurationMap,
  ResourceNames,
} from "./resource.ts";

interface CommonConfigurationProperties {
  dependencies?: Config[];
  dependsOn?: Config;
  ensure?: "present" | "absent";
  resource?: Resource;
}

type ResourceSpecificConfig = {
  [ResourceName in ResourceNames]?: ResourceConfigurationMap[ResourceName];
};

export type Config = CommonConfigurationProperties & ResourceSpecificConfig;

export interface WithDependencies {
  dependencies: Config[];
}
