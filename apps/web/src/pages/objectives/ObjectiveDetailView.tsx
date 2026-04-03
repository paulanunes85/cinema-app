import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { StatusBadge, Badge, AvatarStack, Button, Card } from '@/components/ui';
import { CommentsSection } from '@/components/ui/CommentsSection';
import { ObjectiveStatus } from '@cinema-app/shared';

interface ObjectiveDetailProps {
  objectiveId: string;
  onClose: () => void;
}

export function ObjectiveDetailView({ objectiveId, onClose }: ObjectiveDetailProps) {
  const { user } = useAuth();
  const [objective, setObjective] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [newDecision, setNewDecision] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDesc, setNewLinkDesc] = useState('');

  const fetchObjective = () => {
    api.get<Record<string, unknown>>(`/objectives/${objectiveId}`)
      .then(setObjective)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchObjective(); }, [objectiveId]);

  if (loading || !objective) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-bg-primary rounded-lg p-8">
          <p className="text-text-secondary">A carregar...</p>
        </div>
      </div>
    );
  }

  const status = objective.status as ObjectiveStatus;
  const tabs = [
    { id: 'overview', label: '📋 Geral' },
    { id: 'guide', label: '💡 O Que Fazer' },
    { id: 'vision', label: '🎬 Visão do Diretor' },
    { id: 'decisions', label: '📝 Decisões' },
    { id: 'links', label: '🔗 Documentos' },
    { id: 'comments', label: '💬 Comentários' },
  ];

  const handleStatusChange = async (newStatus: ObjectiveStatus) => {
    await api.patch(`/objectives/${objectiveId}/status`, { status: newStatus });
    fetchObjective();
  };

  const handleAddDecision = async () => {
    if (!newDecision.trim()) return;
    await api.post(`/objectives/${objectiveId}/decisions`, { content: newDecision.trim() });
    setNewDecision('');
    fetchObjective();
  };

  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) return;
    await api.post(`/objectives/${objectiveId}/links`, {
      url: newLinkUrl.trim(),
      description: newLinkDesc.trim() || undefined,
      authorName: (user as Record<string, unknown>)?.displayName ?? 'Anónimo',
    });
    setNewLinkUrl('');
    setNewLinkDesc('');
    fetchObjective();
  };

  const collaborators = (objective.collaborators as { user: { displayName: string; avatarUrl: string | null } }[]) ?? [];
  const decisions = (objective.decisions as { id: string; content: string; createdBy: { displayName: string; avatarUrl: string | null }; createdAt: string }[]) ?? [];
  const links = (objective.links as { id: string; url: string; description: string | null; authorName: string; updatedAt: string }[]) ?? [];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-bg-primary w-full max-w-2xl max-h-[90vh] rounded-t-lg sm:rounded-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-text-primary">{objective.title as string}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge status={status} />
              {objective.deadline && (
                <Badge color="gray">
                  📅 {new Date(objective.deadline as string).toLocaleDateString('pt-BR')}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {collaborators.length > 0 && (
              <AvatarStack
                users={collaborators.map((c) => ({
                  name: c.user.displayName ?? 'Anónimo',
                  avatarUrl: c.user.avatarUrl,
                }))}
                max={4}
              />
            )}
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl cursor-pointer focus-ring rounded p-1" aria-label="Fechar">
              ✕
            </button>
          </div>
        </div>

        {/* Status Actions */}
        <div className="px-4 py-2 bg-bg-secondary border-b border-border flex gap-2 flex-wrap">
          {status === ObjectiveStatus.NOT_STARTED && (
            <Button size="sm" onClick={() => handleStatusChange(ObjectiveStatus.IN_PROGRESS)}>
              🔄 Iniciar
            </Button>
          )}
          {status === ObjectiveStatus.IN_PROGRESS && (
            <Button size="sm" onClick={() => handleStatusChange(ObjectiveStatus.COMPLETED)}>
              ✅ Concluir
            </Button>
          )}
          {status === ObjectiveStatus.COMPLETED && (
            <Button size="sm" variant="secondary" onClick={() => handleStatusChange(ObjectiveStatus.IN_PROGRESS)}>
              🔄 Reabrir
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer
                ${activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text-primary'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {objective.description && (
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-1">Descrição</h4>
                  <p className="text-text-primary">{objective.description as string}</p>
                </div>
              )}
              {objective.sceneOrLocation && (
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-1">Cena / Locação</h4>
                  <p className="text-text-primary">{objective.sceneOrLocation as string}</p>
                </div>
              )}
              {objective.phase && (
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-1">Fase</h4>
                  <p className="text-text-primary">{objective.phase as string}</p>
                </div>
              )}
            </div>
          )}

          {/* What Is Normally Done */}
          {activeTab === 'guide' && (
            <div className="bg-comments-bg rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <h4 className="font-medium text-text-primary">O Que É Normalmente Feito</h4>
              </div>
              <p className="text-text-primary leading-relaxed">
                {(objective.whatIsNormallyDone as string) ?? 'Nenhuma orientação disponível para este tipo de objetivo.'}
              </p>
            </div>
          )}

          {/* Director's Vision */}
          {activeTab === 'vision' && (
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">Visão Criativa do Diretor</h4>
              <p className="text-text-primary leading-relaxed">
                {(objective.directorsVision as string) ?? 'O diretor ainda não adicionou notas para este objetivo.'}
              </p>
            </div>
          )}

          {/* Decisions */}
          {activeTab === 'decisions' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDecision}
                  onChange={(e) => setNewDecision(e.target.value)}
                  placeholder="Registar nova decisão..."
                  className="flex-1 px-3 py-2 border-2 border-border rounded-sm text-sm focus:border-primary outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddDecision()}
                />
                <Button size="sm" onClick={handleAddDecision} disabled={!newDecision.trim()}>
                  Adicionar
                </Button>
              </div>
              {decisions.length === 0 ? (
                <p className="text-text-secondary text-sm text-center py-4">Nenhuma decisão registada.</p>
              ) : (
                <div className="space-y-3">
                  {decisions.map((d) => (
                    <Card key={d.id} padding="sm">
                      <p className="text-text-primary text-sm">{d.content}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {d.createdBy.displayName} · {new Date(d.createdAt).toLocaleDateString('pt-BR')}{' '}
                        {new Date(d.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Links */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="URL do documento..."
                  className="w-full px-3 py-2 border-2 border-border rounded-sm text-sm focus:border-primary outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLinkDesc}
                    onChange={(e) => setNewLinkDesc(e.target.value)}
                    placeholder="Descrição (opcional)"
                    className="flex-1 px-3 py-2 border-2 border-border rounded-sm text-sm focus:border-primary outline-none"
                  />
                  <Button size="sm" onClick={handleAddLink} disabled={!newLinkUrl.trim()}>
                    Adicionar
                  </Button>
                </div>
              </div>
              {links.length === 0 ? (
                <p className="text-text-secondary text-sm text-center py-4">Nenhum documento anexado.</p>
              ) : (
                <div className="space-y-2">
                  {links.map((l) => (
                    <Card key={l.id} padding="sm">
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        🔗 {l.description || l.url}
                      </a>
                      <p className="text-xs text-text-secondary mt-1">
                        {l.authorName} · Atualizado {new Date(l.updatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          {activeTab === 'comments' && (
            <CommentsSection objectiveId={objectiveId} />
          )}
        </div>
      </div>
    </div>
  );
}
