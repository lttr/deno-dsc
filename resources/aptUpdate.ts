import type { Config } from "../configuration.ts";
import { log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import type { SpecificResource } from "../resource.ts";

export type AptUpdateConfig = Config;

export const AptUpdate: SpecificResource<AptUpdateConfig> = {
  name: "aptUpdate",

  get: (_) => {
    return `APT UPDATE`;
  },

  test: async function () {
    // Try to optimize a little: do not run apt update if it was run in this hour
    try {
      const pkgcacheStat = await Deno.lstat("/var/cache/apt/pkgcache.bin");
      const lastAptUpdateTime = pkgcacheStat.mtime?.toISOString();
      // e.g. "2022-11-24T16"
      if (
        lastAptUpdateTime?.substring(0, 13) ==
          new Date().toISOString().substring(0, 13)
      ) {
        return true;
      }
    } catch {
      return false;
    }
    return false;
  },

  set: async (_, verbose) => {
    try {
      const { success, code } = await command(["sudo", "apt-get", "update"]);
      if (!success) {
        log.error(`'apt-get update' exited with status ${code}`);
        return;
      }
      if (verbose) {
        log.info("Apt updated");
      }
    } catch (err) {
      log.error(err);
      log.error(`Apt failed to get updated`);
    }
  },
};
