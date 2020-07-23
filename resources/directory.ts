import { Config } from "../configuration.ts";
import { deno, ensureDir, exists, log } from "../deps.ts";
import { registerResource, SpecificResource } from "../resource.ts";

export interface DirectoryConfiguration extends Config {
  path: string;
}

export const Directory: SpecificResource<DirectoryConfiguration> = {
  name: "directory",

  test: async function({ ensure = "present", path }, verbose) {
    const dirExists = await exists(path);
    if (ensure === "present") {
      if (dirExists && verbose) {
        log.warning(`Directory already exists on path ${path}`);
      }
      return dirExists;
    } else {
      if (dirExists && verbose) {
        log.warning(`Directory does not exists on path ${path}`);
      }
      return !dirExists;
    }
  },

  get: (config: DirectoryConfiguration) => {
    return `directory on path ${config.path}`;
  },

  set: async ({ ensure = "present", path }, verbose) => {
    if (ensure === "present") {
      try {
        await ensureDir(path);
        if (verbose) {
          log.info(`Directory created on path ${path}`);
        }
      } catch (e) {
        throw e;
      }
    } else {
      try {
        await deno.remove(path, { recursive: true });
      } catch (err) {
        if (!(err instanceof deno.errors.NotFound)) {
          throw err;
        }
      }
    }
  }
};

registerResource(Directory);
