import { registerResource } from "../mod.ts";
import { CustomResource } from "./example-custom-resource.ts";
import { configuration } from "./example-configuration.ts";
import { runConfigurationSet } from "../run.ts";

registerResource(CustomResource);
runConfigurationSet(configuration, { dryRun: true });
