import { log, isExecutableFile } from "../deps.ts";
import { command } from "./command.ts";

export async function isExecutable(name: string): Promise<boolean> {
  try {
    const path = await command(["which", name]);
    if (await isExecutableFile(path)) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}
