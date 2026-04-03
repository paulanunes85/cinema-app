import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button, Card, ProgressRing } from '@/components/ui';
import type { ProjectSummary } from '@cinema-app/shared';

export function ProjectsListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<(ProjectSummary & { myRoles: string[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get<(ProjectSummary & { myRoles: string[] })[]>('/projects')
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await api.post('/projects', { name: newName.trim(), description: newDesc.trim() || undefined });
      const updated = await api.get<(ProjectSummary & { myRoles: string[] })[]>('/projects');
      setProjects(updated);
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-secondary">A carregar projectos...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Projetos</h1>
        <Button onClick={() => setShowCreate(true)}>+ Novo Projeto</Button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <h2 className="font-semibold text-text-primary">Novo Projeto</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do projeto"
              required
              className="w-full px-3 py-2 border-2 border-border rounded-sm focus:border-primary outline-none"
              autoFocus
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descrição (opcional)"
              rows={2}
              className="w-full px-3 py-2 border-2 border-border rounded-sm focus:border-primary outline-none resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? 'A criar...' : 'Criar Projeto'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Project list */}
      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-text-secondary">Nenhum projeto ainda.</p>
          <p className="text-text-secondary text-sm">Crie o primeiro para começar!</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.filter((p) => p.status === 'ACTIVE').map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-sm transition-shadow"
              padding="lg"
            >
              <button
                onClick={() => navigate(`/projects/${project.id}`)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary text-lg">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary mt-2">
                      {project.memberCount} {project.memberCount === 1 ? 'membro' : 'membros'}
                    </p>
                  </div>
                  <ProgressRing percentage={project.overallProgress} size="lg" />
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
