import { Config } from "../configuration.ts";
import { download, ensureDir, log, path } from "../deps.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface GnomeShellExtensionInstallerConfig extends Config {
  location: string;
}

const EXE_NAME = "gnome-shell-extension-installer";
const VERSION = "1.7";
const REPO = "https://github.com/brunelli/gnome-shell-extension-installer";
const URL = `${REPO}/releases/download/v${VERSION}/${EXE_NAME}`;

export const GnomeShellExtensionInstaller: SpecificResource<GnomeShellExtensionInstallerConfig> = {
  name: "gnomeShellExtensionInstaller",

  get: _ => {
    return `GNOME SHELL EXTENSION INSTALLER`;
  },

  test: async function({ location }, verbose) {
    if (await isExecutableCommand(path.join(location, EXE_NAME))) {
      if (verbose) {
        log.warning(
          `Program '${EXE_NAME}' is already installed on this machine`
        );
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", location }, verbose) => {
    if (ensure === "present") {
      await ensureDir(location);
      try {
        await download(URL, {
          file: EXE_NAME,
          dir: location,
          mode: 0o744
        });
        if (verbose) {
          log.info(`Program ${EXE_NAME} installed on location '${location}'`);
        }
      } catch (err) {
        log.error(err);
        log.error(`Program ${EXE_NAME} failed to install`);
      }
    } else {
      log.warning(`Removing is not implemented`);
    }
  }
};
