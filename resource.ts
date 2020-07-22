import { Configuration } from "./configuration.ts";
import { DirectoryConfiguration, Directory } from "./resources/directory.ts";
import { SymlinkConfiguration, Symlink } from "./resources/symlink.ts";

export type SpecificResource<T extends Configuration> = {
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

export interface ResourceConfiguration {
  directory: DirectoryConfiguration;
  symlink: SymlinkConfiguration;
}

export type ResourceNames = keyof ResourceConfiguration;
export type ResourceConfigurations = ResourceConfiguration[keyof ResourceConfiguration];

export const resources: Resource[] = [];
export const resourceNames: string[] = [];

export function registerResource(resource: Resource): void {
  resources.push(resource);
  resourceNames.push(resource.name);
}

export function lookupResource(name: string): Resources {
  const found = resources.find(resource => resource.name === name);
  if (found) {
    return found;
  } else {
    throw new Error(`Unknown resource name ${name}`);
  }
}

export function registerBuiltinResources(): void {
  registerResource(Directory);
  registerResource(Symlink);
}
