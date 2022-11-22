import { Config, Resource } from "../mod.ts";

export const CustomResource: Resource = {
  name: "customResource",

  get: (config: CustomResourceConfig) => {
    return config.foo;
  },

  test: (_config, _verbose) => {
    return false;
  },

  set: async (_config, _verbose) => {},
};

export interface CustomResourceConfig extends Config {
  foo: string;
}
