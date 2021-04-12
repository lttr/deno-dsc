import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { SpecificResource } from "../resource.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { command } from "../helpers/command.ts";

export interface GnomeSettingsConfig extends Config {
  schema: string;
  key: string;
  value: string | number | boolean;
}

export const GnomeSettings: SpecificResource<GnomeSettingsConfig> = {
  name: "gnomeSettings",

  get: (config) => {
    return `GNOME SETTINGS ${config.schema} ${config.key} ${config.value}`;
  },

  test: async function ({ schema, key, value }, verbose) {
    if (!(await isExecutableCommand("gsettings"))) {
      log.error(`'gsettings' is probably not an executable on this system`);
      deno.exit(1);
    }
    const { output } = await command(["gsettings", "get", schema, key]);
    let normalizedValue = output.replace(/^'/, "").replace(/'$/, "");
    if (typeof value === "number") {
      let parsedNumber;
      try {
        parsedNumber = parseFloat(normalizedValue);
        const normalizedNumber = parsedNumber.toFixed(1);
        if (Number.isInteger(parsedNumber)) {
          normalizedValue = parsedNumber.toString();
        } else if ("NaN" !== normalizedNumber) {
          normalizedValue = normalizedNumber;
        }
      } catch (e) {
        console.log(e);
      }
      if (value === parsedNumber) {
        if (verbose) {
          log.warning(
            `Gnome settings '${schema} ${key}' is already set to '${value}'`,
          );
        }
        return true;
      } else {
        return false;
      }
    }
    if (normalizedValue === value.toString()) {
      if (verbose) {
        log.warning(
          `Gnome settings '${schema} ${key}' is already set to '${value}'`,
        );
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", schema, key, value }, verbose) => {
    if (ensure === "present") {
      const { success } = await command([
        "gsettings",
        "set",
        schema,
        key,
        value.toString(),
      ]);
      if (success) {
        if (verbose) {
          log.info(`Gnome settings '${schema} ${key}' was set to '${value}'`);
        }
      } else {
        log.error(
          `Gnome settings '${schema} ${key}' was not set to '${value}'`,
        );
      }
    } else {
      log.warning(`It does not make sense to ensure gnome settings is absent`);
    }
  },
};
