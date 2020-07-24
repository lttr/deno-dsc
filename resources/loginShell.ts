import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { SpecificResource } from "../resource.ts";

export interface LoginShellConfig extends Config {
  shell: string;
}

export const LoginShell: SpecificResource<LoginShellConfig> = {
  name: "loginShell",

  get: config => {
    return `LOGIN SHELL ${config.shell}`;
  },

  test: async function({ shell }, verbose) {
    if (deno.env.get("ZSH_NAME") || deno.env.get("ZSH_DIR")) {
      if (verbose) {
        log.warning(`Login shell is already set to '${shell}'`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", shell }, verbose) => {
    if (ensure === "present") {
      const process = deno.run({
        cmd: ["sudo", "chsh", "-s", "/usr/bin/zsh"]
      });
      const { success } = await process.status();
      if (success) {
        if (verbose) {
          log.info(`Shell '${shell}' was set as a login shell`);
        }
      } else {
        log.error(`Shell '${shell}' was not set as a login shell`);
      }
    } else {
      log.warning(
        `It does not make sense to ensure '${shell}' shell is absent`
      );
    }
  }
};
