import { printStatsConfigurationSet, registerResource } from "../mod.ts";
import { CustomResource } from "./example-custom-resource.ts";
import { configuration } from "./example-configuration.ts";

registerResource(CustomResource);
printStatsConfigurationSet(configuration);
