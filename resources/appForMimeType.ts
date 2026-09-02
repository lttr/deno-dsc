import type { Config } from "../configuration.ts";
import { deno, exists, log } from "../deps.ts";
import type { SpecificResource } from "../resource.ts";
import { isExecutableCommand } from "../helpers/isExecutable.ts";
import { command } from "../helpers/command.ts";

export interface AppForMimeTypeConfig extends Config {
  app: string; // '.desktop' file on Linux
  mimeType: string;
}

export const AppForMimeType: SpecificResource<AppForMimeTypeConfig> = {
  name: "appForMimeType",

  get: ({ app, mimeType }) => {
    return `APP FOR MIME TYPE ${app} ${mimeType}`;
  },

  test: async function ({ app, mimeType }, verbose) {
    if (!(await isExecutableCommand("xdg-mime"))) {
      log.error(`'xdg-mime' is probably not an executable on this system`);
      deno.exit(1);
    }
    const { output } = await command([
      "xdg-mime",
      "query",
      "default",
      mimeType,
    ]);
    if (output === app) {
      if (verbose) {
        log.warn(`Mime type '${mimeType}' is already handled by '${app}'`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", app, mimeType }, verbose) => {
    if (ensure === "present") {
      const { success } = await command(["xdg-mime", "default", app, mimeType]);
      // A <desktop>-mimeapps.list (e.g. COSMIC's) outranks the file xdg-mime
      // writes, so update it too or the test never passes.
      const specific = await desktopSpecificMimeappsList();
      if (specific) {
        await setDefaultInMimeappsList(specific, mimeType, app);
      }
      if (success) {
        if (verbose) {
          log.info(`Mime type '${mimeType}' was set to be handled by '${app}'`);
        }
      } else {
        log.error(
          `Mime type '${mimeType}' was not set to be handled by '${app}'`,
        );
      }
    } else {
      log.warn(`Absent mime type handler is not implemented`);
    }
  },
};

async function desktopSpecificMimeappsList(): Promise<string | undefined> {
  const desktops = (deno.env.get("XDG_CURRENT_DESKTOP") ?? "").split(":");
  const configHome = deno.env.get("XDG_CONFIG_HOME") ??
    `${deno.env.get("HOME")}/.config`;
  for (const desktop of desktops.filter(Boolean)) {
    const candidate = `${configHome}/${desktop.toLowerCase()}-mimeapps.list`;
    if (await exists(candidate)) return candidate;
  }
}

async function setDefaultInMimeappsList(
  file: string,
  mimeType: string,
  app: string,
): Promise<void> {
  const GROUP = "[Default Applications]";
  const lines = (await deno.readTextFile(file)).split("\n");
  const start = lines.indexOf(GROUP);
  if (start === -1) {
    log.warn(`No '${GROUP}' group in ${file}, leaving it alone`);
    return;
  }
  const nextGroup = lines.findIndex((l, i) => i > start && l.startsWith("["));
  const end = nextGroup === -1 ? lines.length : nextGroup;
  const entry = `${mimeType}=${app}`;
  const index = lines.findIndex((l, i) =>
    i > start && i < end && l.startsWith(`${mimeType}=`)
  );

  if (index === -1) {
    lines.splice(end, 0, entry);
  } else if (lines[index] === entry) {
    return;
  } else {
    lines[index] = entry;
  }
  await deno.writeTextFile(file, lines.join("\n"));
}
