// std
import * as fs from "https://deno.land/std/fs/mod.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
    file: new log.handlers.FileHandler("DEBUG", {
      filename: `/tmp/deno-dsc-${new Date().getTime()}.log`,
      formatter: "{levelName} {msg}"
    })
  }
});

export { fs };
export { log };
export { path };

export { ensureSymlink } from "https://deno.land/std/fs/ensure_symlink.ts";
export { getFileInfoType } from "https://deno.land/std/fs/_util.ts";
export { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
export { exists as dirExists } from "https://deno.land/std/fs/exists.ts";

export { assert } from "https://deno.land/std/testing/asserts.ts";

// buildin
export const deno = Deno;

// user land
export { digraph, toDot } from "https://deno.land/x/graphviz/mod.ts";
export { download } from "https://deno.land/x/download/mod.ts";
export { isExecutable as isExecutableFile } from "https://deno.land/x/is_exe/mod.ts";
export { jsonTree } from "https://deno.land/x/json_tree/mod.ts";
// export { open } from "https://deno.land/x/opener/mod.ts";
export { open } from "https://raw.githubusercontent.com/denjucks/opener/master/mod.ts";
