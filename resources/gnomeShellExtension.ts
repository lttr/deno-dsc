import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface GnomeShellExtensionConfig extends Config {
  fullName: string;
  id: number;
}

export const GnomeShellExtension: SpecificResource<GnomeShellExtensionConfig> =
  {
    name: "gnomeShellExtension",

    get: ({ fullName }) => {
      return `GNOME SHELL EXTENSION ${fullName}`;
    },

    /**
   * Checks if extension is enabled in gsettings
   */
    test: async function ({ fullName }, verbose) {
      if (!(await isExecutableCommand("gsettings"))) {
        log.error(
          `'gsettings' is needed and is probably not an executable on this system`,
        );
        deno.exit(1);
      }
      const { output } = await command([
        "gsettings",
        "get",
        "org.gnome.shell",
        "enabled-extensions",
      ]);
      if (output.includes(fullName)) {
        if (verbose) {
          log.warning(`Gnome extension '${fullName}' is already enabled`);
        }
        return true;
      } else {
        return false;
      }
    },

    set: async ({ ensure = "present", id, fullName }, verbose) => {
      const extensionsInstaller = "gnome-shell-extension-installer";
      if (!(await isExecutableCommand(extensionsInstaller))) {
        log.error(
          `'${extensionsInstaller}' is needed and is probably not an executable on this system`,
        );
        deno.exit(1);
      }
      if (ensure === "present") {
        await command([extensionsInstaller, id.toString(), "--yes"]);
        if (verbose) {
          log.info(`Gnome extension '${fullName}' installed`);
        }
      } else {
        log.warning(`Removing is not implemented`);
      }
    },
  };
