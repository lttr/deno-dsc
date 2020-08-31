import { Config } from "../configuration.ts";
import { log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { SpecificResource } from "../resource.ts";

export interface AptUpdateConfig extends Config {}

export const AptUpdate: SpecificResource<AptUpdateConfig> = {
  name: "aptUpdate",

  get: _ => {
    return `APT UPDATE`;
  },

  test: async function() {
    return false;
  },

  set: async verbose => {
    try {
      await command(["sudo", "apt-get", "update"]);
      if (verbose) {
        log.info("Apt updated");
      }
    } catch (err) {
      log.error(err);
      log.error(`Apt failed to get updated`);
    }
  }
};
