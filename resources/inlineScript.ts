import { Config } from "../configuration.ts";
import { log } from "../deps.ts";
import { command } from "../helpers/command.ts";
import { SpecificResource } from "../resource.ts";

export interface InlineScriptConfig extends Config {
  name: string;
  testScript: string;
  setScript: string;
}

export const InlineScript: SpecificResource<InlineScriptConfig> = {
  name: "inlineScript",

  get: ({ name }) => {
    return `INLINE SCRIPT ${name}`;
  },

  test: async function ({ name, testScript }, verbose) {
    const { success } = await command(["bash", "-c", testScript]);
    if (success) {
      if (verbose) {
        log.warning(`Inline script '${name}' has been already applied`);
      }
      return true;
    } else {
      return false;
    }
  },

  set: async ({ ensure = "present", name, setScript }, verbose) => {
    if (ensure === "present") {
      const { success } = await command(["sh", "-c", setScript]);
      if (success) {
        if (verbose) {
          log.info(`Inline script '${name}' was applied`);
        }
      } else {
        log.error(`Error occured during inline script '${name}' execution`);
      }
    } else {
      log.warning(`Inline script does not make sence to be absent`);
    }
  },
};
