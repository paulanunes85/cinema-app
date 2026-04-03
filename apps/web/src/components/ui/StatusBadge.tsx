import { ObjectiveStatus } from '@cinema-app/shared';

interface StatusBadgeProps {
  status: ObjectiveStatus;
  className?: string;
}

const STATUS_CONFIG: Record<ObjectiveStatus, { icon: string; label: string; classes: string }> = {
  [ObjectiveStatus.NOT_STARTED]: {
    icon: '⏳',
    label: 'Por Iniciar',
    classes: 'bg-bg-secondary text-text-secondary border border-border',
  },
  [ObjectiveStatus.IN_PROGRESS]: {
    icon: '🔄',
    label: 'Em Progresso',
    classes: 'bg-in-progress-bg text-amber-700 border border-in-progress',
  },
  [ObjectiveStatus.COMPLETED]: {
    icon: '✅',
    label: 'Concluído',
    classes: 'bg-completed-bg text-green-700 border border-completed',
  },
};

/**
 * StatusBadge — Accessible status indicator.
 * ALWAYS uses icon + text + color (never color alone) — FR-UI-05
 */
export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        text-xs font-medium rounded-full
        ${config.classes}
        ${className}
      `}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
