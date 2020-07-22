import {
  showDepGraph,
  Config,
  Configuration,
  registerResource,
  Resource
} from "../mod.ts";

const optDirectory: Config = {
  directory: {
    path: "/opt"
  }
};

const configuration: Config[] = [
  {
    directory: {
      path: "/tmp"
    }
  },
  optDirectory,
  {
    symlink: {
      dest: "/opt",
      src: "/tmp/this-is-opt",
      dependsOn: optDirectory
    }
  }
];

const LoginShell: Resource = {
  name: "loginShell",
  get: config => {
    return config.shell;
  },
  test: async (config, verbose) => {
    return true;
  },
  set: async (config, verbose) => {}
};

export interface LoginShellConfiguration extends Configuration {
  shell: "zsh";
}

registerResource(LoginShell);

showDepGraph(configuration);
