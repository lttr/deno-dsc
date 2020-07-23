import { Config } from "../configuration.ts";
import { deno, ensureDir, exists as dirExists, log } from "../deps.ts";
import { registerResource, SpecificResource } from "../resource.ts";

export interface DirectoryConfiguration extends Config {
  path: string;
}

export const Directory: SpecificResource<DirectoryConfiguration> = {
  name: "directory",

  get: ({ ensure = "present", path }) => {
    return `directory on path ${path}${ensure === "absent" ? " ABSENT" : ""}`;
  },

  test: async function({ ensure = "present", path }, verbose) {
    const exists = await dirExists(path);
    if (ensure === "present") {
      if (exists && verbose) {
        log.warning(`Directory '${path}' already exists`);
      }
      return exists;
    } else {
      if (!exists && verbose) {
        log.warning(`Directory '${path}' does not exists`);
      }
      return !exists;
    }
  },

  set: async ({ ensure = "present", path }, verbose) => {
    if (ensure === "present") {
      try {
        await ensureDir(path);
        if (verbose) {
          log.info(`Directory '${path}' created`);
        }
      } catch (e) {
        throw e;
      }
    } else if (ensure === "absent") {
      try {
        await deno.remove(path, { recursive: true });
        if (verbose) {
          log.info(`Directory '${path}' was removed`);
        }
      } catch (err) {
        if (!(err instanceof deno.errors.NotFound)) {
          throw err;
        }
      }
    }
  }
};

registerResource(Directory);
