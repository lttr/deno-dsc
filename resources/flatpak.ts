import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface FlatpakConfig extends Config {
  appId: string;
  origin?: string;
}

export const Flatpak: SpecificResource<FlatpakConfig> = {
  name: "flatpak",

  get: ({ appId }) => {
    return `FLATPAK ${appId}`;
  },

  test: async function ({ appId }) {
    const { success } = await command(["flatpak", "info", appId], {
      suppressError: true,
    });
    return success;
  },

  set: async ({ ensure = "present", appId, origin = "flathub" }, verbose) => {
    if (!(await isExecutableCommand("flatpak"))) {
      log.error(
        `'flatpak' is needed and is probably not an executable on this system`,
      );
      deno.exit(1);
    }
    if (ensure === "present") {
      const { success } = await command([
        "flatpak",
        "install",
        "-y",
        origin,
        appId,
      ]);
      if (success) {
        if (verbose) {
          log.info(`Flatpak '${appId}' was installed`);
        }
      }
    } else {
      log.warn(`Removing is not implemented`);
    }
  },
};
