import type { FormEvent } from 'react';

export function AuthForm({
  mode,
  email,
  password,
  fullName,
  error,
  loading,
  onChange,
  onSubmit,
  onToggleMode,
}: {
  mode: 'login' | 'register';
  email: string;
  password: string;
  fullName: string;
  error?: string;
  loading: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onToggleMode: () => void;
}) {
  return (
    <div className="auth-panel">
      <h1>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
      <form onSubmit={onSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(event) => onChange('email', event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(event) => onChange('password', event.target.value)}
          minLength={8}
          required
        />
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(event) => onChange('fullName', event.target.value)}
          />
        )}
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : mode === 'login' ? 'Ingresar' : 'Registrar'}
        </button>
      </form>
      <button className="link-button" type="button" onClick={onToggleMode}>
        {mode === 'login'
          ? '¿No tienes cuenta? Crea una ahora'
          : 'Ya tengo cuenta, iniciar sesión'}
      </button>
    </div>
  );
}
