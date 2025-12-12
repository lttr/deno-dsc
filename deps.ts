// std
import * as fs from "@std/fs";
import * as log from "@std/log";
import * as path from "@std/path";

log.setup({
  handlers: {
    console: new log.ConsoleHandler("DEBUG"),
    file: new log.FileHandler("DEBUG", {
      filename: `/tmp/deno-dsc-${new Date().getTime()}.log`,
      formatter: (record) => `${record.levelName} ${record.msg}`,
    }),
  },
});

export { fs };
export { log };
export { path };

export { ensureSymlink } from "@std/fs/ensure-symlink";
export { ensureDir } from "@std/fs/ensure-dir";
export { exists as dirExists } from "@std/fs/exists";

export { assert } from "@std/assert";

// buildin
export const deno = Deno;

// user land
export { digraph, toDot } from "npm:ts-graphviz@^3.0.6";
export { download } from "./vendor/download.ts";
export { isExecutable as isExecutableFile } from "./vendor/is_executable.ts";
export { jsonTree } from "./vendor/json_tree.ts";
export { open } from "./vendor/open.ts";
