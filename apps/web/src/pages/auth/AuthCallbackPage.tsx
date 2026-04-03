import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      refreshUser().then(() => {
        navigate('/', { replace: true });
      });
    } else {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, refreshUser]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: '#6B7280',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <p>A autenticar...</p>
    </div>
  );
}
