import { deno } from "../deps.ts";

export async function command(params: string[]) {
  const process = deno.run({
    cmd: params,
    stdout: "piped"
  });
  await process.status();
  const stdout = await process.output();
  const path = new TextDecoder().decode(stdout).trim();
  await process.close();
  return path;
}
