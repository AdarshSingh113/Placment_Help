import React, { useMemo } from 'react';

interface AudioVisualizerProps {
  isActive?: boolean;
  barCount?: number;
  className?: string;
  theme?: 'dark' | 'light';
  progress?: number; // 0 to 1 (current playback progress)
  onSeek?: (ratio: number) => void;
  interactive?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive = true,
  barCount = 28,
  className = '',
  theme = 'dark',
  progress = 0,
  onSeek,
  interactive = false,
}) => {
  // Generate a realistic, aesthetically pleasing voice waveform pattern (formant curves)
  const barConfigs = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      // Natural bell-curve voice formant distribution
      const norm = i / (barCount - 1); // 0 to 1
      const bell = Math.sin(norm * Math.PI);
      // Deterministic varied heights
      const seed = Math.sin(i * 997 + 13) * 0.5 + 0.5;
      const baseHeightPercent = Math.max(18, Math.min(95, Math.round((bell * 0.7 + seed * 0.3) * 85 + 15)));
      // Deterministic animation durations and delays for completely natural organic motion
      const animDuration = (0.55 + (seed * 0.45)).toFixed(2);
      const animDelay = (seed * 0.4).toFixed(2);

      return {
        baseHeight: baseHeightPercent,
        duration: animDuration,
        delay: animDelay,
      };
    });
  }, [barCount]);

  const handleBarClick = (index: number) => {
    if (interactive && onSeek) {
      const ratio = index / (barCount - 1);
      onSeek(ratio);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-between gap-1 sm:gap-1.5 h-12 px-3 sm:px-4 py-2 rounded-2xl select-none transition-colors ${
        theme === 'dark' ? 'bg-black/60 border border-white/10' : 'bg-neutral-100 border border-black/10'
      } ${interactive ? 'cursor-pointer' : ''} ${className}`}
    >
      {barConfigs.map((cfg, i) => {
        const barRatio = i / (barCount - 1);
        const isPastPlayed = progress > 0 && barRatio <= progress;

        return (
          <div
            key={i}
            onClick={() => handleBarClick(i)}
            className="flex-1 h-full flex items-center justify-center py-1 group/bar relative"
          >
            <div
              className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ${
                isPastPlayed
                  ? 'bg-[#0071e3] shadow-[0_0_6px_rgba(0,113,227,0.6)]'
                  : isActive
                  ? 'bg-gradient-to-t from-[#2997ff] to-[#5ac8fa] shadow-[0_0_6px_rgba(41,151,255,0.4)]'
                  : theme === 'dark'
                  ? 'bg-neutral-700'
                  : 'bg-neutral-300'
              }`}
              style={{
                height: isActive ? `${cfg.baseHeight}%` : '16%',
                minHeight: '4px',
                animation: isActive
                  ? `iosWavePulse ${cfg.duration}s ease-in-out ${cfg.delay}s infinite alternate`
                  : 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
