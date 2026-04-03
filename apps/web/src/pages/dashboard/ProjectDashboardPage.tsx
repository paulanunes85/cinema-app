import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { AppLayout } from '@/components/layout';
import { ObjectiveChecklist } from '@/components/ui/ObjectiveChecklist';
import { ObjectiveDetailView } from '@/pages/objectives/ObjectiveDetailView';
import type { DepartmentSummary } from '@cinema-app/shared';

interface ProjectDetail {
  id: string;
  name: string;
  departments: { id: string; name: string; icon: string | null }[];
}

export function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, logout } = useAuth();
  const { isConnected, subscribe } = useSocket({ projectId });
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [activeDeptId, setActiveDeptId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // TODO: get user roles from project membership
  const isSupervisor = false;

  // Real-time: refresh departments when objective status changes
  useEffect(() => {
    const unsub = subscribe<{ departmentId: string }>('objective:statusChanged', () => {
      if (projectId) {
        api.get<DepartmentSummary[]>(`/projects/${projectId}/departments`).then(setDepartments);
        setRefreshKey((k) => k + 1); // Force checklist refresh
      }
    });
    return unsub;
  }, [subscribe, projectId]);

  useEffect(() => {
    if (!projectId) return;

    Promise.all([
      api.get<ProjectDetail>(`/projects/${projectId}`),
      api.get<DepartmentSummary[]>(`/projects/${projectId}/departments`),
    ]).then(([proj, depts]) => {
      setProject(proj);
      setDepartments(depts);
      if (depts.length > 0 && !activeDeptId) {
        setActiveDeptId(depts[0].id);
      }
    }).finally(() => setLoading(false));
  }, [projectId]);

  if (loading || !project || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary">A carregar...</p>
      </div>
    );
  }

  const activeDept = departments.find((d) => d.id === activeDeptId);

  return (
    <AppLayout
      projectName={`${project.name}${isConnected ? '' : ' (offline)'}`}
      projectId={projectId}
      userName={user.displayName ?? 'Utilizador'}
      userAvatar={user.avatarUrl}
      departments={departments.map((d) => ({
        id: d.id,
        name: d.name,
        icon: d.icon,
        progress: d.progress.percentage,
      }))}
      activeDeptId={activeDeptId}
      onSelectDept={setActiveDeptId}
      showAll={showAll}
      onToggleShowAll={() => setShowAll(!showAll)}
      isSupervisor={isSupervisor}
      onLogout={logout}
    >
      {activeDept ? (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl" aria-hidden="true">
              {activeDept.icon ?? '📁'}
            </span>
            <div>
              <h2 className="text-xl font-bold text-text-primary">{activeDept.name}</h2>
              <p className="text-sm text-text-secondary">
                {activeDept.progress.completed}/{activeDept.progress.total} objetivos concluídos
              </p>
            </div>
          </div>

          <ObjectiveChecklist
            key={`${activeDept.id}-${refreshKey}`}
            departmentId={activeDept.id}
            onSelectObjective={(id) => setSelectedObjectiveId(id)}
            onCreateNew={() => {
              // TODO: open create objective modal
            }}
          />
        </section>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary">Selecione um departamento na sidebar.</p>
        </div>
      )}

      {/* Objective Detail Modal */}
      {selectedObjectiveId && (
        <ObjectiveDetailView
          objectiveId={selectedObjectiveId}
          onClose={() => setSelectedObjectiveId(null)}
        />
      )}
    </AppLayout>
  );
}
