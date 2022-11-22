import { deno } from "../deps.ts";

export async function command(
  params: string[],
): Promise<{
  success: boolean;
  code: number;
  output: string;
}> {
  const process = deno.run({
    cmd: params,
    stdout: "piped",
  });
  const { success, code } = await process.status();
  const stdout = await process.output();
  const output = new TextDecoder().decode(stdout).trim();
  process.close();
  return { success, code, output };
}
