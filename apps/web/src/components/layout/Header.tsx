import { Avatar } from '@/components/ui';
import { NotificationBell } from '@/components/ui/NotificationBell';

interface HeaderProps {
  projectName: string;
  projectId?: string;
  userName: string;
  userAvatar?: string | null;
  onLogout: () => void;
}

export function Header({
  projectName,
  projectId,
  userName,
  userAvatar,
  onLogout,
}: HeaderProps) {
  return (
    <header className="h-14 bg-bg-primary border-b border-border flex items-center justify-between px-6">
      {/* Project name */}
      <div>
        <h2 className="text-sm font-semibold text-text-primary">{projectName}</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationBell projectId={projectId} />

        {/* User */}
        <div className="flex items-center gap-2">
          <Avatar src={userAvatar} name={userName} size="sm" />
          <span className="text-sm text-text-secondary hidden sm:inline">{userName}</span>
          <button
            onClick={onLogout}
            className="text-xs text-text-secondary hover:text-text-primary px-2 py-1 rounded hover:bg-bg-secondary focus-ring cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
