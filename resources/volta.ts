import type { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import type { SpecificResource } from "../resource.ts";

export interface VoltaConfig extends Config {
  name: string;
}

export const Volta: SpecificResource<VoltaConfig> = {
  name: "volta",

  get: ({ name }) => {
    return `VOLTA ${name}`;
  },

  test: async function ({ name }, verbose) {
    if (await isExecutableCommand(name)) {
      if (verbose) {
        log.warn(`Tool '${name}' is already installed`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", name }, verbose) => {
    if (!(await isExecutableCommand(name))) {
      log.error(
        `'${name}' is needed and is probably not an executable on this system`,
      );
      deno.exit(1);
    }
    if (ensure === "present") {
      const { success } = await command([name, "--version"]);
      if (success) {
        if (verbose) {
          log.info(`Tool '${name}' installed`);
        }
      }
    } else {
      log.warn(`Removing is not implemented`);
    }
  },
};
