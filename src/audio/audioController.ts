export type AudioCue = 'ambient' | 'product' | 'act';
export type AudioSources = Partial<Record<AudioCue, string>>;

interface AudioRuntime {
  createContext: () => AudioContext | null;
  load: (path: string, context: AudioContext, signal: AbortSignal) => Promise<AudioBuffer>;
}

const browserRuntime: AudioRuntime = {
  createContext: () => {
    const browser = window as Window & { webkitAudioContext?: typeof AudioContext };
    const Context = window.AudioContext ?? browser.webkitAudioContext;
    return Context ? new Context() : null;
  },
  load: async (path, context, signal) => {
    // Approved audio is self-hosted; reject absolute URLs and protocol-relative URLs.
    if (!path.startsWith('/') || path.startsWith('//'))
      throw new Error('Audio must be self-hosted');
    const response = await fetch(path, { signal, mode: 'same-origin', redirect: 'error' });
    if (!response.ok) throw new Error('Audio download failed');
    return context.decodeAudioData(await response.arrayBuffer());
  },
};

/** A gesture-gated, lazy audio graph; empty sources intentionally remain silent. */
export function createAudioController(sources: AudioSources, runtime = browserRuntime) {
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let enabled = false;
  let visible = true;
  let unlocked = false;
  let disposed = false;
  let generation = 0;
  const abort = new AbortController();
  const buffers = new Map<string, Promise<AudioBuffer | null>>();
  const playing = new Map<AudioCue, AudioBufferSourceNode>();
  const sequence = { ambient: 0, product: 0, act: 0 };
  const allowed = () => enabled && visible && unlocked && !disposed;

  const stop = (cue: AudioCue) => {
    const source = playing.get(cue);
    if (!source) return;
    playing.delete(cue);
    source.onended = null;
    source.stop();
    source.disconnect();
  };
  const pause = () => {
    generation += 1;
    if (master) master.gain.value = 0;
    [...playing.keys()].forEach(stop);
    if (context?.state === 'running') void context.suspend().catch(() => {});
  };

  const play = async (cue: AudioCue) => {
    const path = sources[cue];
    const activeContext = context;
    if (!path || !activeContext || !master || !allowed() || activeContext.state !== 'running')
      return;
    if (cue === 'ambient' && playing.has('ambient')) return;
    const ticket = ++sequence[cue];
    const version = generation;
    if (!buffers.has(path)) {
      buffers.set(
        path,
        runtime.load(path, activeContext, abort.signal).catch(() => {
          buffers.delete(path);
          return null;
        }),
      );
    }
    const buffer = await buffers.get(path);
    if (!buffer || !allowed() || version !== generation || ticket !== sequence[cue]) return;
    stop(cue);
    const source = activeContext.createBufferSource();
    source.buffer = buffer;
    source.loop = cue === 'ambient';
    source.connect(master);
    source.onended = () => {
      if (playing.get(cue) === source) playing.delete(cue);
      source.disconnect();
    };
    playing.set(cue, source);
    source.start();
  };

  const resume = async () => {
    if (!allowed() || !Object.values(sources).some(Boolean)) return;
    try {
      // Creation and resume are invoked synchronously inside the originating gesture.
      if (!context) {
        context = runtime.createContext();
        if (!context) return;
        master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
      }
      if (context.state !== 'running') await context.resume();
      if (!allowed()) {
        pause();
        return;
      }
      if (master) master.gain.value = 0.35;
      await play('ambient');
    } catch {
      // A rejected resume is retried on a later gesture; it must never reject into the UI.
      pause();
    }
  };

  return {
    setEnabled(value: boolean) {
      if (disposed) return;
      enabled = value;
      if (!enabled) pause();
      else void resume();
    },
    setVisible(value: boolean) {
      if (disposed) return;
      visible = value;
      if (!visible) pause();
      else void resume();
    },
    async activate() {
      unlocked = true;
      await resume();
    },
    async play(cue: Exclude<AudioCue, 'ambient'>) {
      try {
        await play(cue);
      } catch {
        /* Audio failure does not block navigation. */
      }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      pause();
      abort.abort();
      buffers.clear();
      master?.disconnect();
      if (context) void context.close().catch(() => {});
    },
  };
}

export type AudioController = ReturnType<typeof createAudioController>;
