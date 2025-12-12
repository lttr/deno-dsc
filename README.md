# deno-dsc

Simple desired state configuration library for `deno`. Inspired by
[Powershell DSC](https://docs.microsoft.com/en-us/powershell/scripting/dsc/overview/overview).

## What

When you need to get your system into desired state. Quickly, reliably,
repeatedly. You can use Ansible, Puppet, Powershell or something else. But this
is simple and you can use JavaScript/TypeScript. `Deno` is the only runtime
dependency.

## Why

I have built this to spin up my development machine using my
[dotfiles](https://github.com/lttr/dotfiles).

## How does it work

Based on your configuration the library build a dependency graph and executes
everything missing in right order. Every configuration is first tested and only
executed, when the test does not pass. Therefore it is idempotent - you can
start it multiple times without worries.

## Adding resource

Add configuration type and implement the resource

```typescript
export interface LoginShellConfig extends Config {
  shell: "zsh";
}

export const LoginShell: SpecificResource<LoginShellConfig> = {
  name: "loginShell",
  get: (config) => {
    //...
  },
  test: async (config, verbose) => {
    //...
  },
  set: async (config, verbose) => {
    //...
  },
};
```

Add to list of types of resources

```typescript
type MyResources = Resources | SpecificResource<LoginShellConfig>;
```

Registr the new resource

```typescript
registerResource(LoginShell);
```

## Test

```
deno task test
```
