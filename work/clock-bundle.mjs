// src/clock.ts
var GameClock = class {
  fraction = 0;
  last = null;
  secondsPerDay = 20;
  reset() {
    this.fraction = 0;
    this.last = null;
  }
  tick(now, active, speed) {
    if (!Number.isFinite(now)) return 0;
    const delta = this.last === null ? 0 : Math.max(0, now - this.last);
    this.last = now;
    if (!active) return 0;
    const rate = [1, 2, 4].includes(speed) ? speed : 1;
    this.fraction += Math.min(delta, 2e3) * rate / (this.secondsPerDay * 1e3);
    const days = Math.floor(this.fraction + 1e-9);
    this.fraction = Math.max(0, this.fraction - days);
    return days;
  }
};
export {
  GameClock
};
