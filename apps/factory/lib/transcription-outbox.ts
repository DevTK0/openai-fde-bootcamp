import type { Command } from "./contracts"
type SegmentCommand = Extract<Command, { kind: "segment" }>

export function transcriptOutbox(options: {
  save: (command: SegmentCommand) => Promise<unknown>
  changed: (pending: SegmentCommand[]) => void
  failed: (error: unknown) => void
}) {
  const queue: SegmentCommand[] = []
  let running = false
  let blocked = false
  async function drain() {
    if (running || blocked) return
    running = true
    try {
      while (queue[0]) {
        await options.save(queue[0])
        queue.shift()
        options.changed([...queue])
      }
    } catch (error) {
      blocked = true
      options.failed(error)
    } finally {
      running = false
    }
  }
  return {
    add(command: SegmentCommand) {
      if (!queue.some((item) => item.id === command.id)) queue.push(command)
      options.changed([...queue])
      void drain()
    },
    retry() {
      blocked = false
      void drain()
    },
  }
}
