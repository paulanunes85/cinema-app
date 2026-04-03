import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  projectName: string;
  projectId?: string;
  userName: string;
  userAvatar?: string | null;
  departments: { id: string; name: string; icon: string | null; progress: number }[];
  activeDeptId: string | null;
  onSelectDept: (id: string) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
  isSupervisor: boolean;
  onLogout: () => void;
}

export function AppLayout({
  children,
  projectName,
  projectId,
  userName,
  userAvatar,
  departments,
  activeDeptId,
  onSelectDept,
  showAll,
  onToggleShowAll,
  isSupervisor,
  onLogout,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar
        departments={departments}
        activeDeptId={activeDeptId}
        onSelectDept={onSelectDept}
        showAll={showAll}
        onToggleShowAll={onToggleShowAll}
        isSupervisor={isSupervisor}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          projectName={projectName}
          projectId={projectId}
          userName={userName}
          userAvatar={userAvatar}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
