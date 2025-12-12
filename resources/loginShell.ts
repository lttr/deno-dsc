import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { SpecificResource } from "../resource.ts";
import { command } from "../helpers/command.ts";

export interface LoginShellConfig extends Config {
  shell: string;
}

export const LoginShell: SpecificResource<LoginShellConfig> = {
  name: "loginShell",

  get: (config) => {
    return `LOGIN SHELL ${config.shell}`;
  },

  test: async function ({ shell }, verbose) {
    if (deno.env.get("ZSH_NAME") || deno.env.get("ZSH_DIR")) {
      if (verbose) {
        log.warn(`Login shell is already set to '${shell}'`);
      }
      return await Promise.resolve(true);
    } else {
      return await Promise.resolve(false);
    }
  },

  set: async ({ ensure = "present", shell }, verbose) => {
    if (ensure === "present") {
      const { success } = await command(["sudo", "chsh", "-s", "/usr/bin/zsh"]);
      if (success) {
        if (verbose) {
          log.info(`Shell '${shell}' was set as a login shell`);
        }
      } else {
        log.error(`Shell '${shell}' was not set as a login shell`);
      }
    } else {
      log.warn(
        `It does not make sense to ensure '${shell}' shell is absent`,
      );
    }
  },
};
