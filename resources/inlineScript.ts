import { Config } from "../configuration.ts";
import { deno, log } from "../deps.ts";
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

  test: async function({ name, testScript }, verbose) {
    const process = deno.run({
      cmd: ["sh", "-c", testScript]
    });
    const { success } = await process.status();
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
      const process = deno.run({
        cmd: ["sh", "-c", setScript]
      });
      const { success } = await process.status();
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
  }
};
