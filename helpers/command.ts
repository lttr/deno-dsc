import { deno } from "../deps.ts";

interface CommandOptions {
  stdin?: string;
  suppressError?: boolean;
}
export async function command(
  params: string[],
  { stdin, suppressError }: CommandOptions = {},
): Promise<{
  success: boolean;
  code: number;
  output: string;
}> {
  const [cmd, ...args] = params;
  const commandOptions: Deno.CommandOptions = {
    args,
    stdout: "piped",
    stderr: suppressError ? "null" : undefined,
    stdin: stdin ? "piped" : undefined,
  };

  const command = new deno.Command(cmd, commandOptions);

  if (stdin) {
    const process = command.spawn();
    const writer = process.stdin.getWriter();
    await writer.write(new TextEncoder().encode(stdin));
    await writer.close();
    const { success, code, stdout } = await process.output();
    const output = new TextDecoder().decode(stdout).trim();
    return { success, code, output };
  }

  const { success, code, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout).trim();
  return { success, code, output };
}
