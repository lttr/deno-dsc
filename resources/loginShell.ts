import { deno, log } from "../deps.ts";
import { SpecificResource, registerResource } from "../resource.ts";
import { Config } from "../configuration.ts";

export interface LoginShellConfiguration extends Config {
  shell: "zsh";
}

export const LoginShell: SpecificResource<LoginShellConfiguration> = {
  name: "loginShell",

  get: config => {
    return `login shell ${config.shell}`;
  },

  test: async function({ shell }, verbose) {
    if (deno.env.get("ZSH_NAME") === "zsh") {
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
      const result = deno.run({
        cmd: ["sudo", "chsh", "-s", "/usr/bin/zsh"]
      });
      const status = await result.status();
      if (verbose) {
        log.info(`Shell '${shell}' was set as a login shell`);
      }
      if (!status.success) {
        log.error(`Shell '${shell}' was not set as a login shell`);
      }
    } else {
      log.warning(
        `It does not make sense to ensure '${shell}' shell is absent`
      );
    }
  }
};

registerResource(LoginShell);
