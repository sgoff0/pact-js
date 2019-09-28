/**
 * Network module.
 * @module net
 * @private
 */

import * as net from "net"
import { Promise as bluebird } from "bluebird"

export const localAddresses = ["127.0.0.1", "localhost", "0.0.0.0", "::1"]

const isPortAvailable = (port: number, host: string): Promise<void> =>
  Promise.resolve(
    bluebird
      .each([host, ...localAddresses], h => portCheck(port, h))
      .then(() => Promise.resolve(undefined))
      .catch(e => Promise.reject(e))
  )

const portCheck = (port: number, host: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const server: any = net
      .createServer()
      .listen({ port, host, exclusive: true })
      .on("error", (e: any) => {
        if (e.code === "EADDRINUSE") {
          reject(new Error(`Port ${port} is unavailable on address ${host}`))
        } else {
          reject(e)
        }
      })
      .on("listening", () => {
        server.once("close", () => resolve()).close()
      })
  })
}

export { isPortAvailable, portCheck }
