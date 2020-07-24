import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { SpecificResource } from "../resource.ts";
import { isExecutable } from "../helpers/isExecutable.ts";
import { command } from "../helpers/command.ts";

export interface GnomeSettingsConfig extends Config {
  schema: string;
  key: string;
  value: string | number | boolean;
}

export const GnomeSettings: SpecificResource<GnomeSettingsConfig> = {
  name: "gnomeSettings",

  get: config => {
    return `GNOME SETTINGS ${config.schema} ${config.key} ${config.value}`;
  },

  test: async function({ schema, key, value }, verbose) {
    if (!(await isExecutable("gsettings"))) {
      log.error(`'gsettings' is probably not an executable on this system`);
      Deno.exit(1);
    }
    const currentValue = await command(["gsettings", "get", schema, key]);
    let normalizedValue = currentValue.replace(/^'/, "").replace(/'$/, "");
    if (typeof value === "number") {
      try {
        const normalizedNumber = parseFloat(normalizedValue).toFixed(1);
        if ("NaN" !== normalizedNumber) {
          normalizedValue = normalizedNumber;
        }
      } catch {}
    }
    if (normalizedValue === value.toString()) {
      if (verbose) {
        log.warning(
          `Gnome settings '${schema} ${key}' is already set to '${value}'`
        );
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", schema, key, value }, verbose) => {
    if (ensure === "present") {
      const process = deno.run({
        cmd: ["gsettings", "set", schema, key, value.toString()],
        stdout: "piped"
      });
      const { success } = await process.status();
      if (success) {
        if (verbose) {
          log.info(`Gnome settings '${schema} ${key}' was set to '${value}'`);
        }
      } else {
        log.error(
          `Gnome settings '${schema} ${key}' was not set to '${value}'`
        );
      }
    } else {
      log.warning(`It does not make sense to ensure gnome settings is absent`);
    }
  }
};
