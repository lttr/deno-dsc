import type { Config } from "../configuration.ts";
import { deno, download, log, path } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import type { SpecificResource } from "../resource.ts";

export interface DebianPackageConfig extends Config {
  name: string;
  url: string;
}

const TEMP_DIR_LINUX = "/tmp";

export const DebianPackage: SpecificResource<DebianPackageConfig> = {
  name: "debianPackage",

  get: ({ name, url }) => {
    return `DEBIAN PACKAGE '${name} from '${url}'`;
  },

  test: async function ({ name }, verbose) {
    if (await isExecutableCommand(name)) {
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
      const fileName = path.basename(new URL(url).pathname);
      const filePath = path.join(TEMP_DIR_LINUX, fileName);
      try {
        await download(url, {
          file: fileName,
          dir: TEMP_DIR_LINUX,
        });
        const { success } = await command([
          "sudo",
          "dpkg",
          "--install",
          filePath,
        ]);
        if (!success) {
          throw new Error(`dpkg was unable to install from path '${filePath}'`);
        }
        if (verbose) {
          log.info(`Program ${name} has been installed`);
        }
      } catch (err) {
        log.error(err);
        log.error(`Program ${name} failed to install`);
      } finally {
        try {
          await deno.remove(filePath);
        } catch (err) {
          log.error(err);
        }
      }
    } else {
      log.warn(`Removing is not implemented`);
    }
  },
};
