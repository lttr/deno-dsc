import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface PnpmGlobalInstallConfig extends Config {
  name: string;
  executable?: string;
}

export const PnpmGlobalInstall: SpecificResource<PnpmGlobalInstallConfig> = {
  name: "pnpmGlobalInstall",

  get: ({ name }) => {
    return `PNPM_GLOBAL_INSTALL ${name}`;
  },

  test: async function ({ name, executable }, verbose) {
    if (await isExecutableCommand(executable || name)) {
      if (verbose) {
        log.warn(`Package '${name}' is already installed`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", name }, verbose) => {
    if (!(await isExecutableCommand("pnpm"))) {
      log.error(
        `Pnpm is needed and is probably not an executable on this system`,
      );
      deno.exit(1);
    }
    if (ensure === "present") {
      const { success } = await command(["pnpm", "add", "-g", name]);
      if (success) {
        if (verbose) {
          log.info(`Package '${name}' installed`);
        }
      }
    } else {
      log.warn(`Removing is not implemented`);
    }
  },
};
