import { showDepGraph } from "../configuration.ts";
import { Configuration, Directory, Symlink } from "../mod.ts";
import { DirectoryConfiguration } from "../resources/directory.ts";
import { SymlinkConfiguration } from "../resources/symlink.ts";

const optDirectory: Configuration = {
  resource: Directory,
  path: "/opt"
} as DirectoryConfiguration;

export const config: Configuration[] = [
  { resource: Directory, path: "/tmp" } as DirectoryConfiguration,
  optDirectory,
  {
    resource: Symlink,
    dest: "/opt",
    src: "/tmp/this-is-opt",
    dependsOn: optDirectory
  } as SymlinkConfiguration
];

showDepGraph(config);
