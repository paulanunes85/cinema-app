import { ObjectiveStatus } from '@cinema-app/shared';
import { StatusBadge, AvatarStack, Badge } from '@/components/ui';

interface ObjectiveCardProps {
  title: string;
  status: ObjectiveStatus;
  deadline?: string | null;
  departmentNames: string[];
  collaborators: { name: string; avatarUrl?: string | null }[];
  onClick?: () => void;
}

const statusCardClasses: Record<ObjectiveStatus, string> = {
  [ObjectiveStatus.NOT_STARTED]: 'bg-bg-primary border-border',
  [ObjectiveStatus.IN_PROGRESS]: 'bg-in-progress-bg border-in-progress',
  [ObjectiveStatus.COMPLETED]: 'bg-completed-bg border-completed opacity-70',
};

export function ObjectiveCard({
  title,
  status,
  deadline,
  departmentNames,
  collaborators,
  onClick,
}: ObjectiveCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-md border-2 transition-all
        hover:shadow-sm focus-ring cursor-pointer
        ${statusCardClasses[status]}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-text-primary truncate">{title}</h3>

          <div className="flex flex-wrap gap-1.5 mt-2">
            <StatusBadge status={status} />
            {deadline && (
              <Badge color="gray">
                📅 {new Date(deadline).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
              </Badge>
            )}
          </div>

          {departmentNames.length > 1 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {departmentNames.map((name) => (
                <Badge key={name} color="purple">{name}</Badge>
              ))}
            </div>
          )}
        </div>

        {collaborators.length > 0 && (
          <AvatarStack users={collaborators} max={3} size="sm" />
        )}
      </div>
    </button>
  );
}
