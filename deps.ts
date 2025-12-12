// std
import * as fs from "jsr:@std/fs@1";
import * as log from "jsr:@std/log@0";
import * as path from "jsr:@std/path@1";

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

export { ensureSymlink } from "jsr:@std/fs@1/ensure-symlink";
export { ensureDir } from "jsr:@std/fs@1/ensure-dir";
export { exists as dirExists } from "jsr:@std/fs@1/exists";

export { assert } from "jsr:@std/assert@1";

// buildin
export const deno = Deno;

// user land
export { digraph, toDot } from "https://deno.land/x/graphviz@v0.2.1/mod.ts";
export { download } from "https://deno.land/x/download@v1.0.0/mod.ts";
export { isExecutable as isExecutableFile } from "https://deno.land/x/is_exe@v1.0.3/mod.ts";
// export { jsonTree } from "https://deno.land/x/json_tree/mod.ts";
export { jsonTree } from "https://raw.githubusercontent.com/satty1987/json_tree/master/mod.ts";
import * as opener from "https://deno.land/x/open@v0.0.5/index.ts";
export const open = opener.open;
