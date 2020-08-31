import { Config } from "./configuration.ts";
import { Antibody, AntibodyConfig } from "./resources/antibody.ts";
import {
  AppForMimeType,
  AppForMimeTypeConfig
} from "./resources/appForMimeType.ts";
import { Brew, BrewConfig } from "./resources/brew.ts";
import {
  DebianPackage,
  DebianPackageConfig
} from "./resources/debianPackage.ts";
import { Directory, DirectoryConfig } from "./resources/directory.ts";
import {
  GnomeSettings,
  GnomeSettingsConfig
} from "./resources/gnomeSettings.ts";
import {
  GnomeShellExtension,
  GnomeShellExtensionConfig
} from "./resources/gnomeShellExtension.ts";
import {
  GnomeShellExtensionInstaller,
  GnomeShellExtensionInstallerConfig
} from "./resources/gnomeShellExtensionInstaller.ts";
import { InlineScript, InlineScriptConfig } from "./resources/inlineScript.ts";
import { LoginShell, LoginShellConfig } from "./resources/loginShell.ts";
import { Symlink, SymlinkConfig } from "./resources/symlink.ts";
import { UrlScript, UrlScriptConfig } from "./resources/urlScript.ts";
import { WebInstall, WebInstallConfig } from "./resources/webInstall.ts";

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

export type Resources =
  | SpecificResource<AntibodyConfig>
  | SpecificResource<AppForMimeTypeConfig>
  | SpecificResource<BrewConfig>
  | SpecificResource<DebianPackageConfig>
  | SpecificResource<DirectoryConfig>
  | SpecificResource<GnomeSettingsConfig>
  | SpecificResource<GnomeShellExtensionConfig>
  | SpecificResource<GnomeShellExtensionInstallerConfig>
  | SpecificResource<InlineScriptConfig>
  | SpecificResource<LoginShellConfig>
  | SpecificResource<SymlinkConfig>
  | SpecificResource<UrlScriptConfig>
  | SpecificResource<WebInstallConfig>;

export interface ResourceConfigurationMap {
  antibody: AntibodyConfig;
  appForMimeType: AppForMimeTypeConfig;
  brew: BrewConfig;
  debianPackage: DebianPackageConfig;
  directory: DirectoryConfig;
  gnomeSettings: GnomeSettingsConfig;
  gnomeShellExtension: GnomeShellExtensionConfig;
  gnomeShellExtensionInstaller: GnomeShellExtensionInstallerConfig;
  inlineScript: InlineScriptConfig;
  loginShell: LoginShellConfig;
  symlink: SymlinkConfig;
  urlScript: UrlScriptConfig;
  webInstall: WebInstallConfig;
}

registerResource(Antibody);
registerResource(AppForMimeType);
registerResource(Brew);
registerResource(DebianPackage);
registerResource(Directory);
registerResource(GnomeSettings);
registerResource(GnomeShellExtension);
registerResource(GnomeShellExtensionInstaller);
registerResource(InlineScript);
registerResource(LoginShell);
registerResource(Symlink);
registerResource(UrlScript);
registerResource(WebInstall);
