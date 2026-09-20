export type Rgb = [number, number, number];

/** CSS custom properties preserve hex notation rather than resolving it to RGB. */
export function parseColor(value: string): Rgb | null {
  const hex = value.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((part) => part + part).join('') : hex;
    return [0, 2, 4].map((start) => parseInt(full.slice(start, start + 2), 16) / 255) as Rgb;
  }
  const rgb = value.trim().match(/^rgba?\(([^)]+)\)$/i)?.[1];
  if (!rgb) return null;
  const parts = rgb
    .split(/[,\s/]+/)
    .filter(Boolean)
    .slice(0, 3);
  if (parts.length !== 3) return null;
  const channels = parts.map((part) => Number.parseFloat(part) / (part.endsWith('%') ? 100 : 255));
  return channels.every((channel) => Number.isFinite(channel) && channel >= 0 && channel <= 1)
    ? (channels as Rgb)
    : null;
}

/** A finite transition reaches its destination even when sampled on every animation frame. */
export function createColorTransition() {
  let from: Rgb | undefined;
  let destination: Rgb | undefined;
  let started = 0;
  const durationMs = 600;

  return {
    sample(target: Rgb, now: number): Rgb {
      if (!from || !destination) {
        from = [...target];
        destination = [...target];
      }
      const progress = Math.min(1, Math.max(0, (now - started) / durationMs));
      const eased = progress * progress * (3 - 2 * progress);
      const end = destination;
      const current = from.map((channel, index) => channel + (end[index] - channel) * eased) as Rgb;
      if (target.some((channel, index) => channel !== end[index])) {
        from = current;
        destination = [...target];
        started = now;
      }
      return current;
    },
  };
}
