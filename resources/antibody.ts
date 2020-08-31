import { Config } from "../configuration.ts";
import { log, deno } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface AntibodyConfig extends Config {
  packageName: string;
}

const EXE_NAME = "antibody";

export const Antibody: SpecificResource<AntibodyConfig> = {
  name: "antibody",

  get: ({ packageName }) => {
    return `ANTIBODY ${packageName}`;
  },

  test: async function() {
    // TODO Implement package detection
    return false;
  },

  set: async ({ ensure = "present", packageName }, verbose) => {
    if (!(await isExecutableCommand(EXE_NAME))) {
      log.error(
        `'${EXE_NAME}' is needed and is probably not an executable on this system`
      );
      deno.exit(1);
    }
    if (ensure === "present") {
      const { success } = await command([EXE_NAME, "bundle", packageName]);
      if (success) {
        if (verbose) {
          log.info(`Package '${packageName}' installed`);
        }
      }
    } else {
      log.warning(`Removing is not implemented`);
    }
  }
};
