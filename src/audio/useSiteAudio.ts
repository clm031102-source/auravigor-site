import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { createAudioController, type AudioController } from '@/audio/audioController';

const preferenceKey = 'auravigor:sound';

/** A06 has not supplied licensed files; keep the same controller API with empty sources. */
export function useSiteAudio() {
  const controller = useRef<AudioController | null>(null);

  useEffect(() => {
    const audio = createAudioController({});
    controller.current = audio;
    let restored = false;
    try {
      restored = localStorage.getItem(preferenceKey) === 'on';
    } catch {
      /* Storage can be denied. */
    }
    audio.setVisible(!document.hidden);
    audio.setEnabled(restored);
    useAppStore.getState().setSoundOn(restored);

    const unsubscribe = useAppStore.subscribe((state, previous) => {
      if (state.soundOn !== previous.soundOn) {
        audio.setEnabled(state.soundOn);
        try {
          localStorage.setItem(preferenceKey, state.soundOn ? 'on' : 'off');
        } catch {
          /* Keep an in-memory preference. */
        }
      }
      if (state.activeIndex !== previous.activeIndex) void audio.play('product');
      if (state.act !== previous.act) void audio.play('act');
    });
    const onVisibility = () => audio.setVisible(!document.hidden);
    const onGesture = (event: Event) => {
      // The sound button handles its own gesture after applying the new preference.
      if (event.target instanceof Element && event.target.closest('[data-sound-toggle]')) return;
      if (useAppStore.getState().soundOn) void audio.activate();
    };
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('pointerdown', onGesture);
    document.addEventListener('keydown', onGesture);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('pointerdown', onGesture);
      document.removeEventListener('keydown', onGesture);
      audio.dispose();
      controller.current = null;
    };
  }, []);

  return () => {
    const store = useAppStore.getState();
    store.toggleSound();
    if (!store.soundOn) void controller.current?.activate();
  };
}
