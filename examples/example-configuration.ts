import type { Config } from "../mod.ts";
import type { CustomResourceConfig } from "./example-custom-resource.ts";

const optDirectory: Config = {
  directory: {
    path: "/opt",
  },
};

type CustomResource = {
  customResource?: CustomResourceConfig;
};

export const configuration: (Config & CustomResource)[] = [
  {
    directory: {
      path: "/temporary",
      ensure: "absent",
    },
  },
  optDirectory,
  {
    symlink: {
      dest: "/opt",
      src: "/tmp/this-is-opt",
      dependsOn: optDirectory,
    },
  },
  {
    customResource: {
      foo: "bar",
    },
  },
];
