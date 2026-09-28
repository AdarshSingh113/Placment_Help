import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 800,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const targetValue = value;
    const diff = targetValue - startValue;

    if (diff === 0) return;

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Smooth ease-out cubic curve (Apple style)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return (
    <span className={`inline-block font-mono tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};
