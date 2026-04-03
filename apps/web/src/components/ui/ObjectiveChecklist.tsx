import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ObjectiveCard, Button } from '@/components/ui';
import { ObjectiveStatus } from '@cinema-app/shared';
import type { ObjectiveSummary } from '@cinema-app/shared';

interface ObjectiveChecklistProps {
  departmentId: string;
  onSelectObjective: (id: string) => void;
  onCreateNew: () => void;
}

type FilterStatus = 'ALL' | ObjectiveStatus;

export function ObjectiveChecklist({
  departmentId,
  onSelectObjective,
  onCreateNew,
}: ObjectiveChecklistProps) {
  const [objectives, setObjectives] = useState<ObjectiveSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('ALL');

  useEffect(() => {
    setLoading(true);
    api
      .get<ObjectiveSummary[]>(`/departments/${departmentId}/objectives`)
      .then(setObjectives)
      .finally(() => setLoading(false));
  }, [departmentId]);

  const filtered =
    filter === 'ALL'
      ? objectives
      : objectives.filter((o) => o.status === filter);

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: ObjectiveStatus.NOT_STARTED, label: '⏳ Por Iniciar' },
    { value: ObjectiveStatus.IN_PROGRESS, label: '🔄 Em Progresso' },
    { value: ObjectiveStatus.COMPLETED, label: '✅ Concluídos' },
  ];

  if (loading) {
    return <p className="text-text-secondary py-8 text-center">A carregar objetivos...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">
          Objetivos ({objectives.length})
        </h3>
        <Button size="sm" onClick={onCreateNew}>
          + Novo Objetivo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap" role="tablist" aria-label="Filtrar por status">
        {filters.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={`
              px-3 py-1.5 text-xs font-medium rounded-full transition-colors
              focus-ring cursor-pointer
              ${
                filter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-bg-secondary text-text-secondary hover:bg-gray-200'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">
            {filter === 'ALL'
              ? 'Nenhum objetivo ainda. Crie o primeiro!'
              : 'Nenhum objetivo com este status.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((obj) => (
            <ObjectiveCard
              key={obj.id}
              title={obj.title}
              status={obj.status as ObjectiveStatus}
              deadline={obj.deadline}
              departmentNames={obj.departmentNames}
              collaborators={obj.collaborators.map((c) => ({
                name: c.displayName,
                avatarUrl: c.avatarUrl,
              }))}
              onClick={() => onSelectObjective(obj.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
