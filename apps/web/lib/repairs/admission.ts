export class RepairAdmission {
  private active = 0
  private started: number[] = []

  acquire(now = Date.now()): (() => void) | null {
    this.started = this.started.filter((at) => now - at < 60_000)
    if (this.active >= 2 || this.started.length >= 6) return null
    this.started.push(now)
    this.active++
    return () => {
      this.active--
    }
  }
}
