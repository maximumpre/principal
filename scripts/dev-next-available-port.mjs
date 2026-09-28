#!/usr/bin/env node
/**
 * Start `next dev` on the first free port at or above the base port.
 *
 * Usage: node scripts/dev-next-available-port.mjs [basePort] [maxPort]
 * Default base port: 3010.
 */
import { spawn } from "node:child_process"
import net from "node:net"
import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const basePort = Number.parseInt(process.argv[2] ?? "3010", 10)
const maxPort = Number.parseInt(process.argv[3] ?? String(basePort + 20), 10)

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.unref()
    server.once("error", () => resolve(false))
    server.once("listening", () => server.close(() => resolve(true)))
    server.listen(port, "127.0.0.1")
  })
}

async function pickPort() {
  for (let port = basePort; port <= maxPort; port += 1) {
    if (await isPortFree(port)) return port
  }
  throw new Error(`No free port between ${basePort} and ${maxPort}`)
}

const port = await pickPort()
console.log(`[dev] starting next dev on port ${port}`)

const child = spawn(
  process.execPath,
  [path.join(projectRoot, "node_modules", "next", "dist", "bin", "next"), "dev", "-p", String(port)],
  { cwd: projectRoot, stdio: "inherit", env: process.env, detached: true },
)

child.unref()

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    try {
      process.kill(-child.pid, signal)
    } catch {
      // child already gone
    }
  })
}

child.on("exit", (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0))
})
