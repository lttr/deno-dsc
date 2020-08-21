// std
import * as fs from "https://deno.land/std@0.65.0/fs/mod.ts";
import * as log from "https://deno.land/std@0.65.0/log/mod.ts";
import * as path from "https://deno.land/std@0.65.0/path/mod.ts";

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

export { ensureSymlink } from "https://deno.land/std@0.65.0/fs/ensure_symlink.ts";
export { getFileInfoType } from "https://deno.land/std@0.65.0/fs/_util.ts";
export { ensureDir } from "https://deno.land/std@0.65.0/fs/ensure_dir.ts";
export { exists as dirExists } from "https://deno.land/std@0.65.0/fs/exists.ts";

export { assert } from "https://deno.land/std@0.65.0/testing/asserts.ts";

// buildin
export const deno = Deno;

// user land
export { digraph, toDot } from "https://deno.land/x/graphviz/mod.ts@v0.2.1";
export { download } from "https://deno.land/x/download/mod.ts@v1.0.0";
export { isExecutable as isExecutableFile } from "https://deno.land/x/is_exe/mod.ts@v1.0.3";
// export { jsonTree } from "https://deno.land/x/json_tree/mod.ts";
export { jsonTree } from "https://raw.githubusercontent.com/satty1987/json_tree/master/mod.ts";
// export { open } from "https://deno.land/x/opener/mod.ts";
export { open } from "https://raw.githubusercontent.com/denjucks/opener/master/mod.ts";
