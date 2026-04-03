import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { ProgressRing, StatusBadge, AvatarStack, Card, Button } from '@/components/ui';
import { ObjectiveStatus } from '@cinema-app/shared';

interface SupervisionData {
  departments: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    progress: { total: number; completed: number; inProgress: number; percentage: number };
    recentObjectives: {
      id: string;
      title: string;
      status: string;
      deadline: string | null;
      collaborators: { displayName: string; avatarUrl: string | null }[];
    }[];
  }[];
  overallProgress: number;
}

export function SupervisionPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<SupervisionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    api
      .get<SupervisionData>(`/projects/${projectId}/supervision`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary">A carregar supervisão...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-danger">{error}</p>
        <Button variant="secondary" onClick={() => navigate(`/projects/${projectId}`)}>
          Voltar ao Projeto
        </Button>
      </div>
    );
  }

  if (!data || !user) return null;

  return (
    <main className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="bg-bg-primary border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="text-text-secondary hover:text-text-primary cursor-pointer focus-ring rounded p-1"
            aria-label="Voltar"
          >
            ← Voltar
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">📊 Modo Supervisão</h1>
            <p className="text-sm text-text-secondary">
              Vista panorâmica de todos os departamentos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <ProgressRing percentage={data.overallProgress} size="lg" />
            <p className="text-xs text-text-secondary mt-1">Progresso Geral</p>
          </div>
        </div>
      </header>

      {/* Department Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.departments.map((dept) => (
            <Card key={dept.id} padding="lg" className="hover:shadow-md transition-shadow">
              {/* Department Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">{dept.icon ?? '📁'}</span>
                  <h3 className="font-semibold text-text-primary">{dept.name}</h3>
                </div>
                <ProgressRing percentage={dept.progress.percentage} size="md" />
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-text-primary">{dept.progress.total}</p>
                  <p className="text-xs text-text-secondary">Total</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-in-progress">{dept.progress.inProgress}</p>
                  <p className="text-xs text-text-secondary">Em Progresso</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-completed">{dept.progress.completed}</p>
                  <p className="text-xs text-text-secondary">Concluídos</p>
                </div>
              </div>

              {/* Recent Objectives */}
              {dept.recentObjectives.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                    Recentes
                  </h4>
                  {dept.recentObjectives.map((obj) => (
                    <div
                      key={obj.id}
                      className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <StatusBadge status={obj.status as ObjectiveStatus} />
                        <span className="text-sm text-text-primary truncate">{obj.title}</span>
                      </div>
                      {obj.collaborators.length > 0 && (
                        <AvatarStack
                          users={obj.collaborators.map((c) => ({
                            name: c.displayName,
                            avatarUrl: c.avatarUrl,
                          }))}
                          max={2}
                          size="sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary text-center py-4">
                  Nenhum objetivo neste departamento
                </p>
              )}

              {/* View All Button */}
              <button
                onClick={() => navigate(`/projects/${projectId}`)}
                className="mt-4 w-full text-center text-sm text-primary hover:underline cursor-pointer focus-ring rounded py-1"
              >
                Ver todos os objetivos →
              </button>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
