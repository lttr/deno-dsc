import { Config } from "../mod.ts";
import { CustomResourceConfiguration } from "./example-custom-resource.ts";

const optDirectory: Config = {
  directory: {
    path: "/opt"
  }
};

type CustomResource = {
  customResource?: CustomResourceConfiguration;
};

export const configuration: (Config & CustomResource)[] = [
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
  },
  {
    customResource: {
      foo: "bar"
    }
  }
];
