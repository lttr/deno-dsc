# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
deno task test                    # Run tests
deno task example-depgraph        # Visualize dependency graph
deno task example-dryrun          # Dry run example configuration
```

## Architecture

Desired state configuration library for Deno - idempotent system configuration via dependency graph execution.

### Core Flow

1. **Configuration** (`configuration.ts`) - Config objects specify resources and dependencies
2. **Resources** (`resource.ts`, `resources/`) - Each resource implements `get`, `test`, `set`:
   - `get(config)` → description string
   - `test(config)` → boolean (already in desired state?)
   - `set(config)` → apply the configuration
3. **Graph** (`graph.ts`) - Builds dependency tree, executes breadth-first
4. **Run** (`run.ts`) - Orchestrates: test → set only if test fails

### Adding a Resource

1. Create `resources/myResource.ts` with `MyResourceConfig` interface and `MyResource: SpecificResource<MyResourceConfig>`
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

Use `dependsOn` for explicit ordering. All configs without dependencies run after a synthetic root node.
