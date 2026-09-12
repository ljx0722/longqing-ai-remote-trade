/** Business time runs only while the player is on the map. One day is 20 seconds at 1x. */
export class GameClock {
  fraction = 0;
  private last: number | null = null;
  readonly secondsPerDay = 20;
  reset(): void {
    this.fraction = 0;
    this.last = null;
  }
  tick(now: number, active: boolean, speed: number): number {
    if (!Number.isFinite(now)) return 0;
    const delta = this.last === null ? 0 : Math.max(0, now - this.last);
    this.last = now;
    if (!active) return 0;
    const rate = [1, 2, 4].includes(speed) ? speed : 1;
    // A suspended tab never replays hours of missed economic events on return.
    this.fraction +=
      (Math.min(delta, 2000) * rate) / (this.secondsPerDay * 1000);
    const days = Math.floor(this.fraction + 1e-9);
    this.fraction = Math.max(0, this.fraction - days);
    return days;
  }
}
