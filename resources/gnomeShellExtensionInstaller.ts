import { Config } from "../configuration.ts";
import { download, log, path } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface GnomeShellExtensionInstallerConfig extends Config {}

const EXE_NAME = "gnome-shell-extension-installer";
const VERSION = "1.7";
const REPO = "https://github.com/brunelli/gnome-shell-extension-installer";
const URL = `${REPO}/releases/download/v${VERSION}/${EXE_NAME}`;
const LOCATION = "/usr/bin/";
const EXECUTABLE_MODE = 0o744;
const TEMP_DIR_LINUX = "/tmp";

export const GnomeShellExtensionInstaller: SpecificResource<GnomeShellExtensionInstallerConfig> = {
  name: "gnomeShellExtensionInstaller",

  get: _ => {
    return `GNOME SHELL EXTENSION INSTALLER`;
  },

  test: async function(verbose) {
    if (await isExecutableCommand(EXE_NAME)) {
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

  set: async ({ ensure = "present" }, verbose) => {
    if (ensure === "present") {
      try {
        await download(URL, {
          file: EXE_NAME,
          dir: TEMP_DIR_LINUX,
          mode: EXECUTABLE_MODE
        });
        await command([
          "sudo",
          "mv",
          path.join(TEMP_DIR_LINUX, EXE_NAME),
          path.join(LOCATION, EXE_NAME)
        ]);
        if (verbose) {
          log.info(`Program ${EXE_NAME} installed on location '${LOCATION}'`);
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
