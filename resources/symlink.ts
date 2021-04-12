import { Config } from "../configuration.ts";
import {
  deno,
  ensureSymlink,
  fs,
  getFileInfoType,
  log,
  path,
} from "../deps.ts";
import { SpecificResource } from "../resource.ts";

export interface SymlinkConfig extends Config {
  dest: string;
  src: string;
}

export const Symlink: SpecificResource<SymlinkConfig> = {
  name: "symlink",

  get: ({ src, dest }) => {
    return `SYMLINK from ${dest} to ${src}`;
  },

  test: async function ({ ensure = "present", src, dest }, verbose) {
    const exists = await symlinkExists(src, dest);
    if (ensure === "present") {
      if (exists && verbose) {
        log.warning(`Symlink '${dest} -> ${path.resolve(src)}' already exists`);
      }
      return exists;
    } else {
      if (!exists && verbose) {
        log.warning(
          `Symlink '${dest} -> ${path.resolve(src)}' does not exists`,
        );
      }
      return !exists;
    }
  },

  set: async ({ ensure = "present", src, dest }, verbose) => {
    if (ensure === "present") {
      try {
        await ensureSymlink(src, dest);
        if (verbose) {
          log.info(`Symlink created: ${dest} -> ${src}`);
        }
      } catch (e) {
        throw e;
      }
    } else if (ensure === "absent") {
      try {
        await deno.remove(dest);
        if (verbose) {
          log.info(`Directory '${dest}' was removed`);
        }
      } catch (err) {
        if (!(err instanceof deno.errors.NotFound)) {
          throw err;
        }
      }
    }
  },
};

export async function symlinkExists(
  src: string,
  dest: string,
): Promise<boolean> {
  if (await fs.exists(dest)) {
    const destStatInfo = await deno.lstat(dest);
    const destFilePathType = getFileInfoType(destStatInfo);
    if (destFilePathType === "symlink") {
      const symlinkDestination = await deno.readLink(dest);
      return path.resolve(src) === symlinkDestination;
    }
  }
  return false;
}
