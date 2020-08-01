import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { SpecificResource } from "../resource.ts";
import { isExecutable } from "../helpers/isExecutable.ts";
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

  test: async function({ app, mimeType }, verbose) {
    if (!(await isExecutable("xdg-mime"))) {
      log.error(`'xdg-mime' is probably not an executable on this system`);
      Deno.exit(1);
    }
    const currentValue = await command([
      "xdg-mime",
      "query",
      "default",
      mimeType
    ]);
    if (currentValue === app) {
      if (verbose) {
        log.warning(`Mime type '${mimeType}' is already handled by '${app}'`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", app, mimeType }, verbose) => {
    if (ensure === "present") {
      const process = deno.run({
        cmd: ["xdg-mime", "default", app, mimeType],
        stdout: "piped"
      });
      const { success } = await process.status();
      if (success) {
        if (verbose) {
          log.info(`Mime type '${mimeType}' was set to be handled by '${app}'`);
        }
      } else {
        log.error(
          `Mime type '${mimeType}' was not set to be handled by '${app}'`
        );
      }
    } else {
      log.warning(`Absent mime type handler is not implemented`);
    }
  }
};
