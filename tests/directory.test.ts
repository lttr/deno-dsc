import { runConfigurationSet } from "../mod.ts";
import { assert, dirExists } from "../deps.ts";

Deno.test("directory is created when it does not exists", async () => {
  // arrange
  const path = "tests/testdata/new-bar-dir";
  const config = [{ directory: { path } }];
  // act
  await runConfigurationSet(config);
  // assert
  assert(dirExists(path));
  // cleanup
  await Deno.remove(path);
});
