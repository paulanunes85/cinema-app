import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setError('Link de verificação inválido.');
      return;
    }

    api
      .get<{ accessToken: string; refreshToken: string }>(`/auth/verify?token=${token}`)
      .then(async (tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        await refreshUser();
        setStatus('success');
        // Auto-redirect after 2s
        setTimeout(() => navigate('/', { replace: true }), 2000);
      })
      .catch((err) => {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Erro ao verificar email');
      });
  }, [searchParams, navigate, refreshUser]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-bg-primary px-6">
      <div className="w-full max-w-sm text-center">
        {status === 'loading' && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-xl font-bold text-text-primary">A verificar email...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Email verificado!</h1>
            <p className="text-text-secondary mb-4">
              A sua conta está ativa. A redirecionar...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Verificação falhou</h1>
            <p className="text-text-secondary mb-6">{error}</p>
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Criar nova conta
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
