# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Commands

```bash
deno task verify                  # Run check, lint, and tests (run after every change)
deno task test                    # Run tests only
deno test --allow-read --allow-write tests/directory.test.ts  # Run single test
deno task example-depgraph        # Visualize dependency graph
deno task example-dryrun          # Dry run example configuration
```

**Important:** Always run `deno task verify` after making changes.

## Architecture

Desired state configuration library for Deno - idempotent system configuration
via dependency graph execution.

### Core Flow

1. **Configuration** (`configuration.ts`) - Config objects specify resources and
   dependencies
2. **Resources** (`resource.ts`, `resources/`) - Each resource implements `get`,
   `test`, `set`:
   - `get(config)` → description string
   - `test(config)` → boolean (already in desired state?)
   - `set(config)` → apply the configuration
3. **Graph** (`graph.ts`) - Builds dependency tree, executes breadth-first
4. **Run** (`run.ts`) - Orchestrates: test → set only if test fails

### Adding a Resource

1. Create `resources/myResource.ts` with `MyResourceConfig` interface and
   `MyResource: SpecificResource<MyResourceConfig>`
2. Add config type to `ResourceConfigurationMap` in `resource.ts`
3. Add to `Resources` union type
4. Call `registerResource(MyResource)`

### Configuration Format

```typescript
const configs: Config[] = [
  { directory: { path: "/opt" } },
  { symlink: { src: "/tmp/link", dest: "/opt", dependsOn: someOtherConfig } },
];
```

Use `dependsOn` for explicit ordering. All configs without dependencies run
after a synthetic root node.

### Available Resources

`aptInstall`, `aptUpdate`, `brew`, `debianPackage`, `directory`, `flatpak`,
`gitClone`, `gnomeSettings`, `gnomeShellExtension`, `inlineScript`,
`loginShell`, `pnpmGlobalInstall`, `symlink`, `urlScript`, `webInstall`

### Key Files

- `mod.ts` - Public API entry point
- `resource.ts` - Resource type definitions and registry
- `resources/` - Individual resource implementations
