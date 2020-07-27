import { Config } from "./configuration.ts";
import { Directory, DirectoryConfig } from "./resources/directory.ts";
import {
  GnomeSettings,
  GnomeSettingsConfig
} from "./resources/gnomeSettings.ts";
import {
  GnomeShellExtensionInstallerConfig,
  GnomeShellExtensionInstaller
} from "./resources/gnomeShellExtensionInstaller.ts";
import {
  GnomeShellExtensionConfig,
  GnomeShellExtension
} from "./resources/gnomeShellExtension.ts";
import { LoginShell, LoginShellConfig } from "./resources/loginShell.ts";
import { Symlink, SymlinkConfig } from "./resources/symlink.ts";

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
  | SpecificResource<DirectoryConfig>
  | SpecificResource<GnomeSettingsConfig>
  | SpecificResource<GnomeShellExtensionConfig>
  | SpecificResource<GnomeShellExtensionInstallerConfig>
  | SpecificResource<LoginShellConfig>
  | SpecificResource<SymlinkConfig>;

export interface ResourceConfigurationMap {
  directory: DirectoryConfig;
  gnomeSettings: GnomeSettingsConfig;
  gnomeShellExtension: GnomeShellExtensionConfig;
  gnomeShellExtensionInstaller: GnomeShellExtensionInstallerConfig;
  loginShell: LoginShellConfig;
  symlink: SymlinkConfig;
}

export type ResourceNames = keyof ResourceConfigurationMap;
export type ResourceConfigurations = ResourceConfigurationMap[keyof ResourceConfigurationMap];

const resources: Resource[] = [];

export function registerResource(resource: Resource): void {
  resources.push(resource);
}

registerResource(Directory);
registerResource(GnomeSettings);
registerResource(GnomeShellExtension);
registerResource(GnomeShellExtensionInstaller);
registerResource(LoginShell);
registerResource(Symlink);

export function lookupResource(name: string): Resources {
  const found = resources.find(resource => resource.name === name);
  if (found) {
    return found;
  } else {
    throw new Error(`Unknown resource name ${name}`);
  }
}
