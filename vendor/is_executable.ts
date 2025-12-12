// Check if a file is executable using Deno.stat

export async function isExecutable(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    if (!stat.isFile) {
      return false;
    }
    // On Unix, check if any execute bit is set
    if (Deno.build.os !== "windows" && stat.mode !== null) {
      // Execute bits: owner (0o100), group (0o010), others (0o001)
      return (stat.mode & 0o111) !== 0;
    }
    // On Windows, assume executable if it's a file
    return true;
  } catch {
    return false;
  }
}
