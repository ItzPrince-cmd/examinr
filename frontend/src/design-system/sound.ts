// Sound Design System
import { Howl } from 'howler';

export interface SoundConfig {
  src: string;
  volume?: number;
  loop?: boolean;
  sprite?: Record<string, [number, number]>;
}

class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private enabled: boolean = true;
  private globalVolume: number = 0.5;

  constructor() {
    // Check localStorage for sound preference
    const savedPreference = localStorage.getItem('examinr-sound-enabled');
    this.enabled = savedPreference !== 'false';
  }

  public register(name: string, config: SoundConfig) {
    const sound = new Howl({
      src: [config.src],
      volume: (config.volume || 1) * this.globalVolume,
      loop: config.loop || false,
      sprite: config.sprite,
    });
    this.sounds.set(name, sound);
  }

  public play(name: string, sprite?: string) {
    if (!this.enabled) return;
    const sound = this.sounds.get(name);
    if (sound) {
      if (sprite) {
        sound.play(sprite);
      } else {
        sound.play();
      }
    }
  }

  public stop(name: string) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.stop();
    }
  }

  public stopAll() {
    this.sounds.forEach((sound) => sound.stop());
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('examinr-sound-enabled', enabled.toString());
    if (!enabled) {
      this.stopAll();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setGlobalVolume(volume: number) {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound) => {
      sound.volume(this.globalVolume);
    });
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Define sound library
export const SOUNDS = {
  // UI Sounds
  click: { src: '/sounds/click.mp3', volume: 0.3 },
  hover: { src: '/sounds/hover.mp3', volume: 0.2 },
  toggle: { src: '/sounds/toggle.mp3', volume: 0.3 },
  
  // Success/Achievement Sounds
  success: { src: '/sounds/success.mp3', volume: 0.4 },
  levelUp: { src: '/sounds/level-up.mp3', volume: 0.5 },
  achievement: { src: '/sounds/achievement.mp3', volume: 0.5 },
  
  // Notification Sounds
  notification: { src: '/sounds/notification.mp3', volume: 0.4 },
  message: { src: '/sounds/message.mp3', volume: 0.3 },
  
  // Error/Warning Sounds
  error: { src: '/sounds/error.mp3', volume: 0.3 },
  warning: { src: '/sounds/warning.mp3', volume: 0.3 },
  
  // Ambient Sounds (for focus modes)
  ambientRain: {
    src: '/sounds/ambient-rain.mp3',
    volume: 0.2,
    loop: true
  },
  ambientForest: {
    src: '/sounds/ambient-forest.mp3',
    volume: 0.2,
    loop: true
  },
  ambientOcean: {
    src: '/sounds/ambient-ocean.mp3',
    volume: 0.2,
    loop: true
  },
  
  // Quiz/Test Sounds
  questionAppear: { src: '/sounds/question-appear.mp3', volume: 0.3 },
  answerSelect: { src: '/sounds/answer-select.mp3', volume: 0.2 },
  timerTick: { src: '/sounds/timer-tick.mp3', volume: 0.2 },
  timeWarning: { src: '/sounds/time-warning.mp3', volume: 0.4 },
} as const;

// Sound sprite for efficient loading
export const UI_SOUND_SPRITE: SoundConfig = {
  src: '/sounds/ui-sprite.mp3',
  sprite: {
    click: [0, 200] as [number, number],
    hover: [300, 150] as [number, number],
    toggle: [500, 300] as [number, number],
    success: [900, 1000] as [number, number],
    error: [2000, 500] as [number, number],
  },
};

// Initialize sounds (call this in your app initialization)
export function initializeSounds() {
  // Register individual sounds
  Object.entries(SOUNDS).forEach(([name, config]) => {
    soundManager.register(name, config);
  });
  
  // Register sprite
  soundManager.register('uiSprite', UI_SOUND_SPRITE);
}

// React Hook for sound management
import { useCallback } from 'react';

export function useSound() {
  const playSound = useCallback((name: string, sprite?: string) => {
    soundManager.play(name, sprite);
  }, []);

  const stopSound = useCallback((name: string) => {
    soundManager.stop(name);
  }, []);

  const toggleSound = useCallback(() => {
    const newState = !soundManager.isEnabled();
    soundManager.setEnabled(newState);
    return newState;
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    soundManager.setEnabled(enabled);
  }, []);

  const isSoundEnabled = useCallback(() => {
    return soundManager.isEnabled();
  }, []);

  const setVolume = useCallback((volume: number) => {
    soundManager.setGlobalVolume(volume);
  }, []);

  return {
    playSound,
    stopSound,
    toggleSound,
    setSoundEnabled,
    isSoundEnabled,
    setVolume,
  };
}