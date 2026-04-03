import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

export function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/register', {
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-bg-primary px-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Verifique o seu email!</h1>
          <p className="text-text-secondary mb-6">
            Enviámos um link de verificação para <strong className="text-text-primary">{email}</strong>.
            Clique no link para ativar a sua conta.
          </p>
          <p className="text-sm text-text-secondary mb-6">
            Não recebeu? Verifique a pasta de spam.
          </p>
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            ← Voltar ao login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-bg-primary px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">🎬 Criar Conta</h1>
          <p className="text-text-secondary">
            Junte-se à plataforma de pré-produção
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="O seu nome"
              required
              className="w-full px-3 py-2.5 border-2 border-border rounded-md text-sm focus:border-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-text-primary mb-1">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-3 py-2.5 border-2 border-border rounded-md text-sm focus:border-primary outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-text-primary mb-1">
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
              className="w-full px-3 py-2.5 border-2 border-border rounded-md text-sm focus:border-primary outline-none transition-colors"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'A criar conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
