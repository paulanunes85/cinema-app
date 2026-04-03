interface BadgeProps {
  children: React.ReactNode;
  color?: 'primary' | 'yellow' | 'green' | 'purple' | 'gray';
  className?: string;
}

const colorClasses: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  yellow: 'bg-in-progress/20 text-amber-700',
  green: 'bg-completed/20 text-green-700',
  purple: 'bg-comments/20 text-purple-700',
  gray: 'bg-bg-secondary text-text-secondary',
};

export function Badge({ children, color = 'gray', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5
        text-xs font-medium rounded-full
        ${colorClasses[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
