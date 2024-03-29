import { Config } from "./configuration.ts";
import {
  AppForMimeType,
  AppForMimeTypeConfig,
} from "./resources/appForMimeType.ts";
import { AptInstall, AptInstallConfig } from "./resources/aptInstall.ts";
import { AptUpdate, AptUpdateConfig } from "./resources/aptUpdate.ts";
import { Brew, BrewConfig } from "./resources/brew.ts";
import {
  DebianPackage,
  DebianPackageConfig,
} from "./resources/debianPackage.ts";
import { Directory, DirectoryConfig } from "./resources/directory.ts";
import { GitClone, GitCloneConfig } from "./resources/gitClone.ts";
import {
  GnomeSettings,
  GnomeSettingsConfig,
} from "./resources/gnomeSettings.ts";
import {
  GnomeShellExtension,
  GnomeShellExtensionConfig,
} from "./resources/gnomeShellExtension.ts";
import {
  GnomeShellExtensionInstaller,
  GnomeShellExtensionInstallerConfig,
} from "./resources/gnomeShellExtensionInstaller.ts";
import { InlineScript, InlineScriptConfig } from "./resources/inlineScript.ts";
import { LoginShell, LoginShellConfig } from "./resources/loginShell.ts";
import {
  PnpmGlobalInstall,
  PnpmGlobalInstallConfig,
} from "./resources/pnpmGlobalInstall.ts";
import { Symlink, SymlinkConfig } from "./resources/symlink.ts";
import { UrlScript, UrlScriptConfig } from "./resources/urlScript.ts";
import { WebInstall, WebInstallConfig } from "./resources/webInstall.ts";

export type SpecificResource<T extends Config> = {
  name: string;
  get: (configuration: T) => string;
  set: (configuration: T, verbose: boolean) => Promise<void>;
  test: (configuration: T, verbose: boolean) => Promise<boolean> | boolean;
};

export interface Resource {
  name: string;
  get: (configuration: any) => string;
  set: (configuration: any, verbose: boolean) => Promise<void>;
  test: (configuration: any, verbose: boolean) => Promise<boolean> | boolean;
}

export type ResourceNames = keyof ResourceConfigurationMap;
export type ResourceConfigurations =
  ResourceConfigurationMap[keyof ResourceConfigurationMap];

export const resources: Resource[] = [];

export function registerResource(resource: Resource): void {
  resources.push(resource);
}

export function lookupResource(name: string): Resources {
  const found = resources.find((resource) => resource.name === name);
  if (found) {
    return found;
  } else {
    throw new Error(`Unknown resource name ${name}`);
  }
}

export type Resources =
  | SpecificResource<AppForMimeTypeConfig>
  | SpecificResource<AptInstallConfig>
  | SpecificResource<AptUpdateConfig>
  | SpecificResource<BrewConfig>
  | SpecificResource<DebianPackageConfig>
  | SpecificResource<DirectoryConfig>
  | SpecificResource<GitCloneConfig>
  | SpecificResource<GnomeSettingsConfig>
  | SpecificResource<GnomeShellExtensionConfig>
  | SpecificResource<GnomeShellExtensionInstallerConfig>
  | SpecificResource<InlineScriptConfig>
  | SpecificResource<LoginShellConfig>
  | SpecificResource<PnpmGlobalInstallConfig>
  | SpecificResource<SymlinkConfig>
  | SpecificResource<UrlScriptConfig>
  | SpecificResource<WebInstallConfig>;

export interface ResourceConfigurationMap {
  appForMimeType: AppForMimeTypeConfig;
  aptInstall: AptInstallConfig;
  aptUpdate: AptUpdateConfig;
  brew: BrewConfig;
  debianPackage: DebianPackageConfig;
  directory: DirectoryConfig;
  gitClone: GitCloneConfig;
  gnomeSettings: GnomeSettingsConfig;
  gnomeShellExtension: GnomeShellExtensionConfig;
  gnomeShellExtensionInstaller: GnomeShellExtensionInstallerConfig;
  inlineScript: InlineScriptConfig;
  loginShell: LoginShellConfig;
  pnpmGlobalInstall: PnpmGlobalInstallConfig;
  symlink: SymlinkConfig;
  urlScript: UrlScriptConfig;
  webInstall: WebInstallConfig;
}

registerResource(AppForMimeType);
registerResource(AptInstall);
registerResource(AptUpdate);
registerResource(Brew);
registerResource(DebianPackage);
registerResource(Directory);
registerResource(GitClone);
registerResource(GnomeSettings);
registerResource(GnomeShellExtension);
registerResource(GnomeShellExtensionInstaller);
registerResource(InlineScript);
registerResource(LoginShell);
registerResource(PnpmGlobalInstall);
registerResource(Symlink);
registerResource(UrlScript);
registerResource(WebInstall);
