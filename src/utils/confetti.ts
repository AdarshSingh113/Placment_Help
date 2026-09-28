import confetti from 'canvas-confetti';

/**
 * Fires an Apple-style celebratory particle burst
 * using elegant champagne gold, electric blue, and silver particles.
 */
export const triggerCelebration = () => {
  try {
    // Left burst
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#0071e3', '#2997ff', '#ffb340', '#34c759', '#ffffff'],
      ticks: 200,
      gravity: 1.1,
      scalar: 0.9,
    });

    // Right burst
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#0071e3', '#2997ff', '#ffb340', '#34c759', '#ffffff'],
      ticks: 200,
      gravity: 1.1,
      scalar: 0.9,
    });
  } catch (err) {
    console.debug('Confetti suppressed:', err);
  }
};

/**
 * Gentle star burst for smaller achievements (e.g. marking a question solved)
 */
export const triggerMicroBurst = (x = 0.5, y = 0.5) => {
  try {
    confetti({
      particleCount: 22,
      spread: 45,
      startVelocity: 25,
      origin: { x, y },
      colors: ['#0071e3', '#ff9f0a', '#ffffff', '#30d158'],
      ticks: 120,
      gravity: 1.2,
      scalar: 0.75,
    });
  } catch (err) {
    console.debug('Confetti suppressed:', err);
  }
};
