interface ProgressRingProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { dim: 32, stroke: 3, fontSize: 'text-[9px]' },
  md: { dim: 48, stroke: 4, fontSize: 'text-xs' },
  lg: { dim: 64, stroke: 5, fontSize: 'text-sm' },
};

export function ProgressRing({ percentage, size = 'md', className = '' }: ProgressRingProps) {
  const { dim, stroke, fontSize } = sizes[size];
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const isComplete = percentage >= 100;
  const strokeColor = isComplete ? 'var(--color-completed)' : 'var(--color-primary)';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={dim} height={dim} aria-hidden="true">
        {/* Background circle */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        {/* Progress circle */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span
        className={`absolute font-semibold ${fontSize}`}
        style={{ color: isComplete ? 'var(--color-completed)' : 'var(--color-text-primary)' }}
        aria-label={`${Math.round(percentage)}% concluído`}
      >
        {Math.round(percentage)}%
      </span>
    </div>
  );
}
