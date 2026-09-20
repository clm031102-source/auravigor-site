import { describe, expect, it, vi } from 'vitest';
import { createAudioController, type AudioSources } from './audioController';

function setup(
  sources: AudioSources = { ambient: '/audio/ambient.wav', product: '/audio/product.wav' },
) {
  const nodes: {
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    loop: boolean;
  }[] = [];
  const gain = { gain: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() };
  const context = {
    state: 'suspended',
    destination: {},
    createGain: vi.fn(() => gain),
    createBufferSource: vi.fn(() => {
      const node = {
        start: vi.fn(),
        stop: vi.fn(),
        connect: vi.fn(),
        disconnect: vi.fn(),
        loop: false,
        onended: null,
      };
      nodes.push(node);
      return node;
    }),
    resume: vi.fn(async () => {
      context.state = 'running';
    }),
    suspend: vi.fn(async () => {
      context.state = 'suspended';
    }),
    close: vi.fn(async () => {
      context.state = 'closed';
    }),
  };
  const factory = vi.fn(() => context as unknown as AudioContext);
  const load = vi.fn(async () => ({}) as AudioBuffer);
  const controller = createAudioController(sources, { createContext: factory, load });
  return { controller, factory, load, context, nodes, gain };
}

describe('audio playback policy', () => {
  it('stays silent and loads nothing until enabled and unlocked by a gesture', async () => {
    const { controller, factory, load } = setup();
    controller.setEnabled(true);
    await controller.play('product');
    expect(factory).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
    await controller.activate();
    expect(factory).toHaveBeenCalledOnce();
    expect(load).toHaveBeenCalledOnce();
    controller.dispose();
  });

  it('keeps the placeholder silent without allocating an audio context', async () => {
    const { controller, factory, load } = setup({});
    controller.setEnabled(true);
    await controller.activate();
    await controller.play('product');
    expect(factory).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
    controller.dispose();
  });

  it('loops ambience, caches lazy files, and stops sound when disabled', async () => {
    const { controller, load, nodes, gain } = setup();
    controller.setEnabled(true);
    await controller.activate();
    expect(nodes[0].loop).toBe(true);
    await controller.play('product');
    await controller.play('product');
    expect(load).toHaveBeenCalledTimes(2);
    expect(nodes).toHaveLength(3);
    controller.setEnabled(false);
    expect(gain.gain.value).toBe(0);
    nodes.forEach((node) => expect(node.stop).toHaveBeenCalledOnce());
    controller.dispose();
  });

  it('mutes hidden pages and does not queue product sounds for later', async () => {
    const { controller, load, context, gain } = setup();
    controller.setEnabled(true);
    await controller.activate();
    controller.setVisible(false);
    expect(gain.gain.value).toBe(0);
    expect(context.suspend).toHaveBeenCalledOnce();
    await controller.play('product');
    expect(load).toHaveBeenCalledOnce();
    controller.dispose();
  });

  it('does not play an asset that finishes loading after sound was turned off', async () => {
    const { controller, load, nodes } = setup();
    let resolveLoad: ((buffer: AudioBuffer) => void) | undefined;
    load.mockImplementationOnce(
      () =>
        new Promise<AudioBuffer>((resolve) => {
          resolveLoad = resolve;
        }),
    );
    controller.setEnabled(true);
    const activation = controller.activate();
    await vi.waitFor(() => expect(load).toHaveBeenCalledOnce());
    controller.setEnabled(false);
    resolveLoad?.({} as AudioBuffer);
    await activation;
    expect(nodes).toHaveLength(0);
    controller.dispose();
  });

  it('handles browser autoplay rejection and retries on a later gesture', async () => {
    const { controller, context, nodes } = setup();
    context.resume.mockRejectedValueOnce(new Error('NotAllowedError'));
    controller.setEnabled(true);
    await expect(controller.activate()).resolves.toBeUndefined();
    expect(nodes).toHaveLength(0);
    await controller.activate();
    expect(nodes).toHaveLength(1);
    controller.dispose();
  });

  it('releases the audio graph and prevents playback after disposal', async () => {
    const { controller, context, nodes, gain } = setup();
    controller.setEnabled(true);
    await controller.activate();
    controller.dispose();
    expect(context.close).toHaveBeenCalledOnce();
    expect(gain.disconnect).toHaveBeenCalledOnce();
    await controller.play('product');
    expect(nodes).toHaveLength(1);
  });

  it('resumes only ambience when the page becomes visible again', async () => {
    const { controller, load, nodes } = setup();
    controller.setEnabled(true);
    await controller.activate();
    controller.setVisible(false);
    await controller.play('product');
    controller.setVisible(true);
    await vi.waitFor(() => expect(nodes).toHaveLength(2));
    expect(nodes[1].loop).toBe(true);
    expect(load).toHaveBeenCalledOnce();
    controller.dispose();
  });

  it('treats download or decoding failures as silence and permits a retry', async () => {
    const { controller, load, nodes } = setup();
    load.mockRejectedValueOnce(new Error('decode failed'));
    controller.setEnabled(true);
    await controller.activate();
    expect(nodes).toHaveLength(0);
    await controller.activate();
    expect(nodes).toHaveLength(1);
    controller.dispose();
  });

  it('keeps at most one in-flight effect per cue when interactions arrive rapidly', async () => {
    const { controller, nodes } = setup();
    controller.setEnabled(true);
    await controller.activate();
    await Promise.all([
      controller.play('product'),
      controller.play('product'),
      controller.play('product'),
    ]);
    expect(nodes).toHaveLength(2);
    controller.dispose();
  });
});
