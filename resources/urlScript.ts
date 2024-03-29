import { Config } from "../configuration.ts";
import { log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { SpecificResource } from "../resource.ts";

export interface UrlScriptConfig extends Config {
  name: string;
  url: string;
  postInstall?: string;
}

export const UrlScript: SpecificResource<UrlScriptConfig> = {
  name: "urlScript",

  get: ({ name, url }) => {
    return `URL SCRIPT '${name} from '${url}'`;
  },

  test: async function ({ name }, verbose) {
    if (await isExecutableCommand(name)) {
      if (verbose) {
        log.warning(`Program '${name}' is already installed on this machine`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async (
    { ensure = "present", name, url, postInstall },
    verbose,
  ) => {
    if (ensure === "present") {
      try {
        const { success: downloaded, output: script } = await command([
          "curl",
          "--fail",
          "--show-error",
          "--silent",
          "--location",
          url,
        ]);
        if (downloaded) {
          const { success } = await command(
            ["bash", "-s"],
            { stdin: script },
          );
          if (success) {
            if (verbose) {
              log.info(`Program ${name} was installed`);
            }
          }

          if (postInstall) {
            const { success: postSuccess } = await command([
              "bash",
              "-c",
              postInstall,
            ]);
            if (postSuccess) {
              if (verbose) {
                log.info(`Post install script for '${name}' was applied`);
              }
            } else {
              log.error(
                `Error occured during post install script for '${name}'`,
              );
            }
          }
        } else {
          log.error(`Can't download from ${name}`);
        }
      } catch (err) {
        log.error(err);
        log.error(`Program ${name} failed to install`);
      }
    } else {
      log.warning(`Removing is not implemented`);
    }
  },
};
