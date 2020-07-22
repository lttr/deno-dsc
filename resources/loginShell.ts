import { deno, log } from "../deps.ts";
import { SpecificResource } from "../resource.ts";
import { Configuration } from "../configuration.ts";

export interface LoginShellConfiguration extends Configuration {
  shell: "zsh";
}

export const LoginShell: SpecificResource<LoginShellConfiguration> = {
  name: "loginShell",

  test: async function({ shell }, verbose) {
    if (deno.env.get("ZSH_NAME") === "zsh") {
      if (verbose) {
        log.warning(`Login shell is already set to ${shell}`);
      }
      return true;
    } else {
      return false;
    }
  },

  get: config => {
    return `login shell ${config.shell}`;
  },

  set: async ({ ensure = "present", shell }, verbose) => {
    if (ensure === "present") {
      const result = deno.run({
        cmd: ["sudo", "chsh", "-s", "/usr/bin/zsh"]
      });
      const status = await result.status();
      if (!status.success) {
        log.error(`Shell ${shell} was not set as a login shell.`);
      }
    }
  }
};
