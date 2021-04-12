import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface WebInstallConfig extends Config {
  name: string;
  version?: string;
}

export const WebInstall: SpecificResource<WebInstallConfig> = {
  name: "webInstall",

  get: ({ name, version }) => {
    return `WEB INSTALL ${name}@${version}`;
  },

  test: async function ({ name }, verbose) {
    if (await isExecutableCommand(name)) {
      if (verbose) {
        log.warning(`Tool '${name}' is already installed`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", name, version = "stable" }, verbose) => {
    const webi = "webi";
    if (!(await isExecutableCommand(webi))) {
      log.error(
        `'${webi}' is needed and is probably not an executable on this system`,
      );
      deno.exit(1);
    }
    if (ensure === "present") {
      const { success } = await command([webi, `${name}@${version}`]);
      if (success) {
        if (verbose) {
          log.info(`Tool '${name}' installed`);
        }
      }
    } else {
      log.warning(`Removing is not implemented`);
    }
  },
};
