import { Config } from "./configuration.ts";
import { DirectoryConfiguration } from "./resources/directory.ts";
import { SymlinkConfiguration } from "./resources/symlink.ts";
import { LoginShellConfiguration } from "./resources/loginShell.ts";

export type SpecificResource<T extends Config> = {
  name: string;
  get: (configuration: T) => string;
  set: (configuration: T, verbose: boolean) => Promise<void>;
  test: (configuration: T, verbose: boolean) => Promise<boolean>;
};

export interface Resource {
  name: string;
  get: (configuration: any) => string;
  set: (configuration: any, verbose: boolean) => Promise<void>;
  test: (configuration: any, verbose: boolean) => Promise<boolean>;
}

export type Resources =
  | SpecificResource<DirectoryConfiguration>
  | SpecificResource<SymlinkConfiguration>;

export interface ResourceConfigurationMap {
  directory: DirectoryConfiguration;
  symlink: SymlinkConfiguration;
  loginShell: LoginShellConfiguration;
}

export type ResourceNames = keyof ResourceConfigurationMap;
export type ResourceConfigurations = ResourceConfigurationMap[keyof ResourceConfigurationMap];

const resources: Resource[] = [];

export function registerResource(resource: Resource): void {
  resources.push(resource);
}

export function lookupResource(name: string): Resources {
  const found = resources.find(resource => resource.name === name);
  if (found) {
    return found;
  } else {
    throw new Error(`Unknown resource name ${name}`);
  }
}
