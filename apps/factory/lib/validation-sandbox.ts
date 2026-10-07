import { constants } from "node:fs"
import { access, readFile, realpath } from "node:fs/promises"
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path"
import { z } from "zod"

async function executable(command: string, worktree: string) {
  const candidates = isAbsolute(command)
    ? [command]
    : command.includes("/")
      ? [resolve(worktree, command)]
      : (process.env.PATH || "").split(":").map((path) => join(path, command))
  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK)
      return await realpath(candidate)
    } catch {
      /* Try the next PATH entry. */
    }
  }
  throw new Error(`Validation executable is unavailable: ${command}`)
}
const packageSchema = z.object({
  bin: z.union([z.string(), z.record(z.string(), z.string())]),
})
async function installation(path: string) {
  for (
    let directory = dirname(path);
    directory !== dirname(directory);
    directory = dirname(directory)
  ) {
    let manifest: string
    try {
      manifest = await readFile(join(directory, "package.json"), "utf8")
    } catch {
      continue
    }
    // Only installed packages may expose their supporting files to checks.
    const parent = dirname(directory)
    const owner = basename(parent).startsWith("@") ? dirname(parent) : parent
    if (basename(owner) !== "node_modules") continue
    try {
      const parsed = packageSchema.safeParse(JSON.parse(manifest))
      if (!parsed.success) continue
      const bins =
        typeof parsed.data.bin === "string"
          ? [parsed.data.bin]
          : Object.values(parsed.data.bin)
      for (const bin of bins) {
        if (
          (await realpath(resolve(directory, bin)).catch(() => null)) === path
        )
          return directory
      }
    } catch {
      /* An invalid manifest cannot establish package ownership. */
    }
  }
  return path
}
export async function validationSandbox(worktree: string, command: string) {
  const executablePath = await executable(command, worktree)
  const relativePath = relative(await realpath(worktree), executablePath)
  const local = relativePath !== ".." && !relativePath.startsWith("../")
  const binary = local ? join("/workspace", relativePath) : executablePath
  const node = await realpath(process.execPath)
  const mounts = new Set([node])
  if (!local) mounts.add(await installation(executablePath))
  const prefix = [
    "--unshare-all",
    "--die-with-parent",
    "--new-session",
    "--ro-bind",
    "/usr",
    "/usr",
    "--ro-bind",
    "/bin",
    "/bin",
    "--ro-bind",
    "/lib",
    "/lib",
    "--ro-bind-try",
    "/lib64",
    "/lib64",
    "--proc",
    "/proc",
    "--dev",
    "/dev",
    "--tmpfs",
    "/tmp",
    ...[...mounts].flatMap((path) => ["--ro-bind", path, path]),
    "--bind",
    worktree,
    "/workspace",
    "--chdir",
    "/workspace",
    "--clearenv",
    "--setenv",
    "PATH",
    `${dirname(node)}:${dirname(binary)}:/usr/local/bin:/usr/bin:/bin`,
    "--setenv",
    "HOME",
    "/tmp",
    "--setenv",
    "CI",
    "1",
    "--",
  ]
  return { prefix, binary, node }
}
