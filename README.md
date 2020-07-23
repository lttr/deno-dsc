# deno-dsc

Simple desired state configuration library for `deno`. Inspired by [Powershell DSC](https://docs.microsoft.com/en-us/powershell/scripting/dsc/overview/overview).

## What

When you need to get your system into desired state. Quickly, Reliably, repeatedly. You can use Ansible, Puppet, Powershell or something else. But this is simple and you can use JavaScript/TypeScript. `Deno` is the only dependency (and runtime at the same time).

## Why

I have built this to spin up my development machine using my [dotfiles](https://github.com/lttr/dotfiles).

## How does it work

Based on your configuration the library build a dependency graph and executes everything missing in right order. Every configuration is first tested and only executed, when the test does not pass. Therefore it is idempotent - you can start it multiple times without worries.

## Adding resource


Add configuration type and implement the resource
```ts
export interface LoginShellConfiguration extends Config {
  shell: "zsh";
}

export const LoginShell: Resource<LoginShellConfiguration> = {
  name: "loginShell",
  get: (config) => {
    //...
  },
  test: async (config, verbose) => {
    //...
  },
  set: async (config, verbose) => {
    //...
  }
};
```

Add to list of types of resources

```ts
type MyResources = Resources | Resource<LoginShellConfiguration>;
```

Registr the new resource
```
registerResource(LoginShell);
```