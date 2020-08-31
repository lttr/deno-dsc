import { Config } from "../configuration.ts";
import { log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { SpecificResource } from "../resource.ts";

export interface AptInstallConfig extends Config {
  packageName: string;
}

export const AptInstall: SpecificResource<AptInstallConfig> = {
  name: "aptInstall",

  get: ({ packageName }) => {
    return `APT INSTALL ${packageName}`;
  },

  test: async function({ packageName }) {
    const { success } = await command(["dpkg-query", "-W", packageName]);
    return success;
  },

  set: async ({ ensure = "present", packageName }, verbose) => {
    if (ensure === "present") {
      const { success } = await command([
        "sudo",
        "apt-get",
        "install",
        "-y",
        packageName
      ]);
      if (success) {
        if (verbose) {
          log.info(`Apt package '${packageName}' was installed`);
        }
      }
    } else {
      log.warning(`Removing is not implemented`);
    }
  }
};
