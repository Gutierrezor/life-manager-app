import { useState } from 'react';
import { api, AUTH_TOKEN_KEY, getApiErrorMessage } from '../api/api';

type AuthResponse = {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export default function AuthView({ onAuth }: { onAuth: (user: AuthResponse['user']) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: 'demo@lifemanager.local', password: 'demo-password' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const { data } = await api.post<AuthResponse>(`/auth/${mode}`, payload);

      localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
      onAuth(data.user);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon">✦</span>
          <strong>LifeManager</strong>
        </div>

        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Entrar</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Crear cuenta</button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <div className="field">
              <label>Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
            </div>
          )}
          <div className="field">
            <label>Correo</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button className="btn-primary" disabled={submitting}>
            {submitting ? 'Validando...' : mode === 'login' ? 'Iniciar sesión' : 'Registrarme'}
          </button>
        </form>
      </section>
    </main>
  );
}
