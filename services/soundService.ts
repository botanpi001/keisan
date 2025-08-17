// A shared AudioContext to avoid creating too many instances, which can be resource-intensive.
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  // If context exists and is running, reuse it.
  if (audioContext && audioContext.state !== 'closed') {
    return audioContext;
  }
  try {
    // Create a new AudioContext. The 'any' cast is for webkitAudioContext compatibility.
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioContext;
  } catch (e) {
    console.error("Web Audio API is not supported in this browser.", e);
    return null;
  }
};

type SoundType = 'correct' | 'incorrect';

/**
 * Plays a sound effect using the Web Audio API.
 * @param type The type of sound to play: 'correct' or 'incorrect'.
 */
export const playSound = (type: SoundType) => {
  const context = getAudioContext();
  if (!context) return;
  
  // Browsers may suspend the AudioContext after a period of inactivity or on page load.
  // We need to resume it to play sound, often triggered by a user gesture.
  if (context.state === 'suspended') {
      context.resume();
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  // Start with volume 0 to prevent clicks.
  gainNode.gain.setValueAtTime(0, context.currentTime);

  if (type === 'correct') {
    oscillator.type = 'sine';
    // A pleasant, rising two-note sound to indicate success.
    gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.01);
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
    oscillator.frequency.linearRampToValueAtTime(698.46, context.currentTime + 0.1); // F5
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);
  } else if (type === 'incorrect') {
    oscillator.type = 'square';
    // A short, descending, slightly dissonant sound for an incorrect answer.
    gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
    oscillator.frequency.setValueAtTime(220, context.currentTime); // A3
    oscillator.frequency.linearRampToValueAtTime(164.81, context.currentTime + 0.1); // E3
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);
  }

  oscillator.start(context.currentTime);
  // Schedule the oscillator to stop after the sound has finished playing.
  oscillator.stop(context.currentTime + 0.5);
};
