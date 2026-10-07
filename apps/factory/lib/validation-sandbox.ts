import { constants } from "node:fs"
import { access, realpath } from "node:fs/promises"
import { dirname, isAbsolute, join } from "node:path"

async function executable(command: string) {
  const candidates = isAbsolute(command)
    ? [command]
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
async function installation(path: string) {
  let directory = dirname(path)
  while (directory !== dirname(directory)) {
    try {
      await access(join(directory, "package.json"))
      return directory
    } catch {
      /* Standalone executables need only their own file. */
    }
    directory = dirname(directory)
  }
  return path
}
export async function validationSandbox(worktree: string, command: string) {
  const binary = await executable(command)
  const node = await realpath(process.execPath)
  const mounts = new Set([await installation(binary), node])
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
