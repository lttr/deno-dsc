import { Config } from "../configuration.ts";
import { log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

//
// https://webinstall.dev/
//

const EXE_NAME = "webi";
const WEBI_URL = "https://webinstall.dev/webi";

export interface WebiConfig extends Config {}

export const Webi: SpecificResource<WebiConfig> = {
  name: "webi",

  get: _ => {
    return `WEBI`;
  },

  test: async function({}, verbose) {
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
        const { success: downloaded, output: webiScript } = await command([
          "curl",
          "--silent",
          WEBI_URL
        ]);
        if (downloaded) {
          const { success } = await command(["bash", "-c", webiScript]);
          if (success) {
            if (verbose) {
              log.info(`Program ${EXE_NAME} was installed`);
            }
          }
        } else {
          log.error(`Can't download from ${WEBI_URL}`);
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
