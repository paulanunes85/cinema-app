import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        padding: '2rem',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1F2937',
            marginBottom: '0.5rem',
          }}
        >
          🎬 Production Bible
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: '#6B7280',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          Plataforma colaborativa para gestão de pré-produção audiovisual
        </p>

        <button
          onClick={login}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.875rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 500,
            color: '#1F2937',
            backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#4A6CF7';
            e.currentTarget.style.backgroundColor = '#F7F7F9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E5E7EB';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
          aria-label="Entrar com Google"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Entrar com Google
        </button>
      </div>
    </main>
  );
}
