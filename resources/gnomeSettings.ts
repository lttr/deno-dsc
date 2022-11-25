import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
import { SpecificResource } from "../resource.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { command } from "../helpers/command.ts";

export interface GnomeSettingsConfig extends Config {
  schema: string;
  key: string;
  value: string | number | boolean;
  schemadir?: string;
}

export const GnomeSettings: SpecificResource<GnomeSettingsConfig> = {
  name: "gnomeSettings",

  get: (config) => {
    let reducedValue = config.value;
    if (typeof config.value === "string" && config.value.length > 30) {
      reducedValue = "...long string...";
    }
    return `GNOME SETTINGS ${config.schema} ${config.key} ${reducedValue}`;
  },

  test: async function ({ schema, key, value, schemadir }, verbose) {
    if (!(await isExecutableCommand("gsettings"))) {
      log.error(`'gsettings' is probably not an executable on this system`);
      deno.exit(1);
    }
    let commandLine = ["gsettings", "get", schema, key];
    if (schemadir) {
      commandLine = ["gsettings", "--schemadir", schemadir, "get", schema, key];
    }
    const { output } = await command(commandLine);
    let normalizedValue = output
      .replace(/^'/, "")
      .replace(/'$/, "")
      .replace("uint32", "")
      .trim();
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

  set: async (
    { ensure = "present", schema, key, value, schemadir },
    verbose,
  ) => {
    if (ensure === "present") {
      let commandLine = [
        "gsettings",
        "set",
        schema,
        key,
        value.toString(),
      ];
      if (schemadir) {
        commandLine = [
          "gsettings",
          "--schemadir",
          schemadir,
          "set",
          schema,
          key,
          value.toString(),
        ];
      }
      const { success } = await command(commandLine);
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
