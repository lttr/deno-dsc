import { Config, Resource } from "../mod.ts";

export const CustomResource: Resource = {
  name: "customResource",

  get: config => {
    return config.foo;
  },

  test: async (config, verbose) => {
    return false;
  },

  set: async (config, verbose) => {}
};

export interface CustomResourceConfiguration extends Config {
  foo: string;
}
