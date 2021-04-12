import { registerResource, showDepGraph } from "../mod.ts";
import { CustomResource } from "./example-custom-resource.ts";
import { configuration } from "./example-configuration.ts";

registerResource(CustomResource);
showDepGraph(configuration);
