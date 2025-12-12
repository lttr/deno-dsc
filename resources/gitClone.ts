import type { Config } from "../configuration.ts";
import { log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { dirExists } from "../deps.ts";
import type { SpecificResource } from "../resource.ts";

export interface GitCloneConfig extends Config {
  url: string;
  target: string;
}

export const GitClone: SpecificResource<GitCloneConfig> = {
  name: "gitClone",

  get: ({ url, target }) => {
    return `GIT CLONE From '${url}' to directory: '${target}'`;
  },

  test: async function ({ target }, verbose) {
    if (await dirExists(target)) {
      if (verbose) {
        log.warn(`Directory '${target}' already exists`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", url, target }, verbose) => {
    if (ensure === "present") {
      try {
        const { success: cloned } = await command([
          "git",
          "clone",
          "--depth=1",
          url,
          target,
        ]);
        if (cloned) {
          if (verbose) {
            log.info(`Repository ${url} was cloned into ${target}`);
          }
        } else {
          log.error(`Can't clone from ${url}`);
        }
      } catch (err) {
        log.error(err);
        log.error(`Failed to git clone from ${url} into ${target}`);
      }
    } else {
      log.warn(`Removing is not implemented`);
    }
  },
};
