// std
import * as fs from "https://deno.land/std/fs/mod.ts@0.65";
import * as log from "https://deno.land/std/log/mod.ts@0.65";
import * as path from "https://deno.land/std/path/mod.ts@0.65";

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

export { ensureSymlink } from "https://deno.land/std/fs/ensure_symlink.ts@0.65";
export { getFileInfoType } from "https://deno.land/std/fs/_util.ts@0.65";
export { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts@0.65";
export { exists as dirExists } from "https://deno.land/std/fs/exists.ts@0.65";

export { assert } from "https://deno.land/std/testing/asserts.ts@0.65";

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
