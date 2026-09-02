import type { Config } from "../configuration.ts";
import { deno, download, log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import type { SpecificResource } from "../resource.ts";

export interface DebianPackageConfig extends Config {
  name: string;
  url: string;
  /** Binary to test for when it differs from `name` (e.g. Obsidian's CLI
   * helper is also called `obsidian`, so `name` alone gives false positives). */
  executable?: string;
}

const TEMP_DIR_LINUX = "/tmp";

export const DebianPackage: SpecificResource<DebianPackageConfig> = {
  name: "debianPackage",

  get: ({ name, url }) => {
    return `DEBIAN PACKAGE '${name} from '${url}'`;
  },

  test: async function ({ name, executable }, verbose) {
    if (await isExecutableCommand(executable ?? name)) {
      if (verbose) {
        log.warn(`Program '${name}' is already installed on this machine`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", name, url }, verbose) => {
    if (ensure === "present") {
      let filePath = "";
      try {
        const downloaded = await download(url, {
          dir: TEMP_DIR_LINUX,
        });
        filePath = downloaded.fullPath;
        // apt-get, not dpkg: dpkg can't resolve the .deb's dependencies.
        const { success } = await command([
          "sudo",
          "apt-get",
          "install",
          "-y",
          filePath,
        ]);
        if (!success) {
          throw new Error(`apt was unable to install from path '${filePath}'`);
        }
        if (verbose) {
          log.info(`Program ${name} has been installed`);
        }
      } catch (err) {
        log.error(err);
        log.error(`Program ${name} failed to install`);
      } finally {
        // filePath is empty when the download itself failed.
        if (filePath) {
          try {
            await deno.remove(filePath);
          } catch (err) {
            log.error(err);
          }
        }
      }
    } else {
      log.warn(`Removing is not implemented`);
    }
  },
};
