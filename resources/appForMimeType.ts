import type { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import type { SpecificResource } from "../resource.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { command } from "../helpers/command.ts";

export interface AppForMimeTypeConfig extends Config {
  app: string; // '.desktop' file on Linux
  mimeType: string;
}

export const AppForMimeType: SpecificResource<AppForMimeTypeConfig> = {
  name: "appForMimeType",

  get: ({ app, mimeType }) => {
    return `APP FOR MIME TYPE ${app} ${mimeType}`;
  },

  test: async function ({ app, mimeType }, verbose) {
    if (!(await isExecutableCommand("xdg-mime"))) {
      log.error(`'xdg-mime' is probably not an executable on this system`);
      deno.exit(1);
    }
    const { output } = await command([
      "xdg-mime",
      "query",
      "default",
      mimeType,
    ]);
    if (output === app) {
      if (verbose) {
        log.warn(`Mime type '${mimeType}' is already handled by '${app}'`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", app, mimeType }, verbose) => {
    if (ensure === "present") {
      const { success } = await command(["xdg-mime", "default", app, mimeType]);
      if (success) {
        if (verbose) {
          log.info(`Mime type '${mimeType}' was set to be handled by '${app}'`);
        }
      } else {
        log.error(
          `Mime type '${mimeType}' was not set to be handled by '${app}'`,
        );
      }
    } else {
      log.warn(`Absent mime type handler is not implemented`);
    }
  },
};
