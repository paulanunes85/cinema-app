import { ProgressRing } from '@/components/ui';

interface SidebarProps {
  departments: { id: string; name: string; icon: string | null; progress: number }[];
  activeDeptId: string | null;
  onSelectDept: (id: string) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
  isSupervisor: boolean;
}

export function Sidebar({
  departments,
  activeDeptId,
  onSelectDept,
  showAll,
  onToggleShowAll,
  isSupervisor,
}: SidebarProps) {
  return (
    <aside className="w-64 h-screen bg-bg-secondary border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold text-text-primary">🎬 Production Bible</h1>
      </div>

      {/* Show All toggle (non-supervisors only) */}
      {!isSupervisor && (
        <div className="px-4 py-3 border-b border-border">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={showAll}
              onChange={onToggleShowAll}
              className="rounded border-border"
            />
            Ver todos os departamentos
          </label>
        </div>
      )}

      {/* Department list */}
      <nav className="flex-1 overflow-y-auto py-2" aria-label="Departamentos">
        <ul className="space-y-1 px-2">
          {departments.map((dept) => (
            <li key={dept.id}>
              <button
                onClick={() => onSelectDept(dept.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5
                  rounded-md text-sm font-medium transition-colors
                  focus-ring cursor-pointer
                  ${
                    activeDeptId === dept.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-primary hover:bg-bg-primary'
                  }
                `}
                aria-current={activeDeptId === dept.id ? 'page' : undefined}
              >
                <span aria-hidden="true">{dept.icon ?? '📁'}</span>
                <span className="flex-1 text-left truncate">{dept.name}</span>
                <ProgressRing percentage={dept.progress} size="sm" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Supervision link */}
      {isSupervisor && (
        <div className="p-3 border-t border-border">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10 focus-ring cursor-pointer">
            <span aria-hidden="true">📊</span>
            Supervisão
          </button>
        </div>
      )}
    </aside>
  );
}
