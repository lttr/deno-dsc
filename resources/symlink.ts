import { Configuration } from "../configuration.ts";
import {
  deno,
  ensureSymlink,
  fs,
  getFileInfoType,
  log,
  path
} from "../deps.ts";
import { SpecificResource } from "../resource.ts";

export interface SymlinkConfiguration extends Configuration {
  dest: string;
  src: string;
}

export const Symlink: SpecificResource<SymlinkConfiguration> = {
  name: "symlink",
  test: async function({ src, dest }, verbose) {
    const exists = await symlinkExists(src, dest);
    if (exists && verbose) {
      log.warning(`Symlink already exists: ${dest} -> ${path.resolve(src)}`);
    }
    return exists;
  },

  get: ({ src, dest }) => {
    return `symlink from ${dest} to ${src}`;
  },

  set: async ({ src, dest }, verbose) => {
    try {
      await ensureSymlink(src, dest);
      if (verbose) {
        log.info(`Symlink created: ${dest} -> ${src}`);
      }
    } catch (e) {
      throw e;
    }
  }
};

export async function symlinkExists(
  src: string,
  dest: string
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
