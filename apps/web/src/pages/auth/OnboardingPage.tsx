import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Role } from '@cinema-app/shared';

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  { value: Role.DIRECTOR, label: 'Realizador(a)', description: 'Líder criativo com acesso de supervisão' },
  { value: Role.AD, label: 'Assistente de Realização', description: 'Coordenação de produção com acesso de supervisão' },
  { value: Role.DEPARTMENT_HEAD, label: 'Chefe de Departamento', description: 'Ex: Diretor de Fotografia, Diretor de Arte' },
  { value: Role.TEAM_MEMBER, label: 'Membro de Equipa', description: 'Equipa dentro de um departamento específico' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleRole = (role: Role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Por favor insira o seu nome');
      return;
    }
    if (selectedRoles.length === 0) {
      setError('Selecione pelo menos um papel');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/users/onboarding', {
        displayName: displayName.trim(),
      });
      await refreshUser();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao completar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F7F7F9',
        padding: '2rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.25rem' }}>
          Bem-vindo(a)! 🎬
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
          Configure o seu perfil para começar
        </p>

        {/* Display Name */}
        <label
          htmlFor="displayName"
          style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#1F2937', marginBottom: '0.5rem' }}
        >
          Nome
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="O seu nome"
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '1rem',
            marginBottom: '1.5rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Roles */}
        <fieldset style={{ border: 'none', padding: 0, marginBottom: '1.5rem' }}>
          <legend
            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1F2937', marginBottom: '0.5rem' }}
          >
            Papel na produção
          </legend>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ROLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleRole(option.value)}
                aria-pressed={selectedRoles.includes(option.value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0.75rem',
                  border: `2px solid ${selectedRoles.includes(option.value) ? '#4A6CF7' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  backgroundColor: selectedRoles.includes(option.value) ? '#EEF2FF' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <span style={{ fontWeight: 500, color: '#1F2937' }}>{option.label}</span>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{option.description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" style={{ color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.875rem',
            backgroundColor: '#4A6CF7',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'A guardar...' : 'Continuar'}
        </button>
      </form>
    </main>
  );
}
