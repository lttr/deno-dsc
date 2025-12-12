import type { Config } from "./configuration.ts";
import {
  AppForMimeType,
  type AppForMimeTypeConfig,
} from "./resources/appForMimeType.ts";
import { AptInstall, type AptInstallConfig } from "./resources/aptInstall.ts";
import { AptUpdate, type AptUpdateConfig } from "./resources/aptUpdate.ts";
import { Brew, type BrewConfig } from "./resources/brew.ts";
import {
  DebianPackage,
  type DebianPackageConfig,
} from "./resources/debianPackage.ts";
import { Flatpak, type FlatpakConfig } from "./resources/flatpak.ts";
import { Directory, type DirectoryConfig } from "./resources/directory.ts";
import { GitClone, type GitCloneConfig } from "./resources/gitClone.ts";
import {
  GnomeSettings,
  type GnomeSettingsConfig,
} from "./resources/gnomeSettings.ts";
import {
  GnomeShellExtension,
  type GnomeShellExtensionConfig,
} from "./resources/gnomeShellExtension.ts";
import {
  GnomeShellExtensionInstaller,
  type GnomeShellExtensionInstallerConfig,
} from "./resources/gnomeShellExtensionInstaller.ts";
import { InlineScript, type InlineScriptConfig } from "./resources/inlineScript.ts";
import { LoginShell, type LoginShellConfig } from "./resources/loginShell.ts";
import {
  PnpmGlobalInstall,
  type PnpmGlobalInstallConfig,
} from "./resources/pnpmGlobalInstall.ts";
import { Symlink, type SymlinkConfig } from "./resources/symlink.ts";
import { UrlScript, type UrlScriptConfig } from "./resources/urlScript.ts";
import { WebInstall, type WebInstallConfig } from "./resources/webInstall.ts";

export type SpecificResource<T extends Config> = {
  name: string;
  get: (configuration: T) => string;
  set: (configuration: T, verbose: boolean) => Promise<void>;
  test: (configuration: T, verbose: boolean) => Promise<boolean> | boolean;
};

// deno-lint-ignore no-explicit-any
export type Resource = SpecificResource<any>;

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
  | SpecificResource<FlatpakConfig>
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
  flatpak: FlatpakConfig;
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
registerResource(Flatpak);
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
