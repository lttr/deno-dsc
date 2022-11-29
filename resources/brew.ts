import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface BrewConfig extends Config {
  name: string;
  executable?: string;
  head?: boolean;
}

export const Brew: SpecificResource<BrewConfig> = {
  name: "brew",

  get: ({ name }) => {
    return `BREW ${name}`;
  },

  test: async function ({ name, executable }, verbose) {
    if (await isExecutableCommand(executable || name)) {
      if (verbose) {
        log.warning(`Program '${name}' is already installed`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", name, head = false }, verbose) => {
    const brew = "brew";
    if (!(await isExecutableCommand(brew))) {
      log.error(
        `'${brew}' is needed and is probably not an executable on this system`,
      );
      deno.exit(1);
    }
    if (ensure === "present") {
      const brewCommand = [brew, "install", `${name}`];
      if (head) {
        brewCommand.push("--HEAD");
      }
      const { success } = await command(brewCommand);
      if (success) {
        if (verbose) {
          log.info(`Program '${name}' installed`);
        }
      }
    } else {
      log.warning(`Removing is not implemented`);
    }
  },
};
